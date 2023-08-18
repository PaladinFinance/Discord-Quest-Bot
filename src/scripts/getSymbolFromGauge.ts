import axios from 'axios';
import { ProtocolType } from '../listener/ethers/questCreationListener';
import { getAddress } from 'ethers';
import ERC20 from '../data/abi/ERC20.json';
import BunniGauge from '../data/abi/BunniGauge.json';
import { Contract } from 'ethers';
import provider from '../config/etherProvider';

const getBalancerSymbol = async (recipient: string, chain: string): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-${chain.toLowerCase()}`,
      {
        query: `{
          liquidityGauges(where: {streamer: "${recipient}"}) {
            symbol,
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (
    !res.data ||
    !res.data.data ||
    !res.data.data.liquidityGauges ||
    res.data.data.liquidityGauges === 0
  )
    return;
  return res.data.data.liquidityGauges[0].symbol;
};

const determineBalancerChain = async (gauge: string): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges`,
      {
        query: `{
          rootGauge(id: "${gauge.toLowerCase()}") {
            chain
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data || !res.data.data || !res.data.data.rootGauge) return;
  return res.data.data.rootGauge.chain;
};

const getSymbolFromBalancerLiquidityGauge = async (gauge: string): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges`,
      {
        query: `{
          liquidityGauge(id: "${gauge.toLowerCase()}") {
            symbol
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data || !res.data.data || !res.data.data.liquidityGauge) return;
  return res.data.data.liquidityGauge.symbol;
};

const getBalancerRecipient = async (gauge: string) => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges`,
      {
        query: `{
          rootGauge(id: "${gauge.toLowerCase()}") {
            recipient
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data || !res.data.data || !res.data.data.rootGauge) return;
  return res.data.data.rootGauge.recipient;
};

const getSymbolFromBalancerRootGauge = async (gauge: string): Promise<string | undefined> => {
  // Get the pool address
  const recipient = await getBalancerRecipient(gauge);
  if (!recipient) return;

  // Determine the chain
  const chain = await determineBalancerChain(gauge);
  if (!chain) return;

  // Get the pool address
  const symbol = await getBalancerSymbol(recipient, chain);
  return symbol;
};

const getSymbolFromBalancerGauge = async (gauge: string): Promise<string> => {
  const mainetSymbol = await getSymbolFromBalancerLiquidityGauge(gauge);
  if (mainetSymbol) return mainetSymbol;

  const altSymbol = await getSymbolFromBalancerRootGauge(gauge);
  if (altSymbol) return altSymbol;

  return '';
};

const getSymbolFromCurveGauge = async (expectedGauge: string): Promise<string> => {
  try {
    const res = await axios.get('https://api.curve.fi/api/getAllGauges');

    for (const gauge in res.data.data) {
      if (getAddress(res.data.data[gauge].gauge) === expectedGauge) {
        return res.data.data[gauge].shortName.split(' ')[0];
      }
    }
  } catch (err) {
    console.error(err);
  }
  return '';
};

const getLpTokenAddressFromBunniGauge = async (gauge: string): Promise<string> => {
  const gaugeContract = new Contract(gauge, BunniGauge, provider);
  const lpAddress = await gaugeContract.lp_token();
  return lpAddress;
};

const getNameFromLpToken = async (lpToken: string): Promise<string> => {
  const lpTokenContract = new Contract(lpToken, ERC20, provider);
  const name = await lpTokenContract.name();
  return name;
};

const getSymbolFromBunniGauge = async (expectedGauge: string): Promise<string> => {
  try {
    const lpAddress = await getLpTokenAddressFromBunniGauge(expectedGauge);
    const name = await getNameFromLpToken(lpAddress);
    return name.replace('Bunni ', '').replace(' LP', '');
  } catch (err) {
    console.error(err);
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
    default:
      return '';
  }
};

export default getSymbolFromGauge;
