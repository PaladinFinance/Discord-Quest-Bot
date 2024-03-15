import axios from 'axios';
import { ProtocolType } from '../type/protocolType';
import { Contract, getAddress } from 'ethers';
import provider from '../config/etherProvider';
import ERC20ABI from '../data/abi/ERC20.json';

const getSymbolFromFxGauge =  async (gauge: string): Promise<string> => {
  const gaugeContract = new Contract(gauge, ERC20ABI, provider);
  return (await gaugeContract.symbol()).replace("-f-gauge", "");
}

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

const getSymbolFromGauge = async (gauge: string, protocol: ProtocolType): Promise<string> => {
  switch (protocol) {
    case ProtocolType.Balancer:
      return getSymbolFromBalancerGauge(gauge);
    case ProtocolType.Curve:
      return getSymbolFromCurveGauge(gauge);
    case ProtocolType.Bunni:
      return getSymbolFromBunniGauge(gauge);
    case ProtocolType.Fx:
      return getSymbolFromFxGauge(gauge);
    default:
      return '';
  }
};

export default getSymbolFromGauge;
