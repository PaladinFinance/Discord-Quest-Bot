import axios from 'axios';
import { ProtocolType } from '../type/protocolType';
import { Contract, Provider, getAddress } from 'ethers';
import etherProvider from '../config/etherProvider';
import FxGauge from '../data/abi/FxGauge.json';
import { ChainIds } from '../globals/chainIds';

const getSymbolFromBalancerGauge = async (gauge: string): Promise<string> => {
  try {
    const res = await axios.post('https://api-v3.balancer.fi/', {
      query:
        'query VeBalGetVotingList {\n  veBalGetVotingList {\n    symbol\n    gauge {\n      address\n    }\n  }\n}',
      operationName: 'VeBalGetVotingList',
    });

    for (const currentGauge of res.data.data.veBalGetVotingList) {
      if (getAddress(gauge) === getAddress(currentGauge.gauge.address)) {
        return currentGauge.symbol;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return '';
};

const getSymbolFromCurveGauge = async (expectedGauge: string): Promise<string> => {
  try {
    const res = await axios.get('https://api.curve.fi/api/getAllGauges');

    for (const gauge in res.data.data) {
      if (getAddress(res.data.data[gauge].gauge) === getAddress(expectedGauge)) {
        return res.data.data[gauge].shortName.split(' ')[0];
      }
    }
  } catch (err) {
    console.error(err);
  }
  return '';
};

const getBunniChainGauges = async (
  chain: string,
): Promise<{ address: string; symbol: string }[]> => {
  try {
    const res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/bunniapp/bunni-${chain}`,
      {
        query:
          '{\n  bunniTokens(\n    where: {gauge_: {address_not: "0x0000000000000000000000000000000000000000"}}\n  ) {\n    gauge {\n      address\n    }\n    name\n  }\n}',
      },
    );
    const gauges: { address: string; symbol: string }[] = res.data.data.bunniTokens.map(
      (gauge: any) => ({
        address: gauge.gauge.address,
        symbol: gauge.name,
      }),
    );

    return gauges;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const getSymbolFromBunniGauge = async (expectedGauge: string): Promise<string> => {
  const chains = ['mainnet', 'arbitrum'];

  for (const chain of chains) {
    const gauges = await getBunniChainGauges(chain);
    for (const gauge of gauges) {
      if (getAddress(gauge.address) === getAddress(expectedGauge)) {
        return gauge.symbol.replace('Bunni ', '').replace(' LP', '');
      }
    }
  }
  return '';
};

const getSymbolFromCurveLp = async (expectedLp: string): Promise<string> => {
  try {
    const res = await axios.get('https://api.curve.fi/api/getPools/all');

    for (const lp of res.data.data.poolData) {
      if (getAddress(lp.address) === getAddress(expectedLp)) {
        return lp.coins.map((coin: any) => coin.symbol).join('+');
      }
    }
  } catch (err) {
    console.error(err);
  }
  return '';
};

const getSymbolFromFxGauge = async (gauge: string, provider: Provider): Promise<string> => {
  try {
    const gaugeContract = new Contract(gauge, FxGauge, provider);
    const stakingToken = await gaugeContract.stakingToken();

    let symbol = await getSymbolFromCurveLp(stakingToken);

    // fallback to ERC20 symbol
    if (symbol === '') {
      symbol = (await gaugeContract.symbol()).replace('-gauge', '');
    }
    return symbol;
  } catch (err) {
    console.error(err);
    return '';
  }
};

const getSymbolFromGauge = async (
  gauge: string,
  protocol: ProtocolType,
  chainId: ChainIds,
): Promise<string> => {
  const provider = etherProvider[chainId];
  switch (protocol) {
    case ProtocolType.Balancer:
      return getSymbolFromBalancerGauge(gauge);
    case ProtocolType.Curve:
      return getSymbolFromCurveGauge(gauge);
    case ProtocolType.Bunni:
      return getSymbolFromBunniGauge(gauge);
    case ProtocolType.Fx:
      return getSymbolFromFxGauge(gauge, provider);
    default:
      return '';
  }
};

export default getSymbolFromGauge;
