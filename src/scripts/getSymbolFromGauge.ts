import { Contract } from 'ethers';
import etherProvider from '../config/etherProvider';
import ERC20 from '../data/abi/ERC20.json';
import CurveGaugeAbi from '../data/abi/CurveGaugeAbi.json';
import axios from 'axios';
import { ProtocolType } from './getProtocolEmbed';

const getSymbol = async (recipient: string, chain: string): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-${chain.toLowerCase()}`,
      {
        query: `{
          liquidityGauge(where: {streamer: "${recipient}"}) {
            symbol
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data.data.liquidityGauge) return;
  return res.data.data.liquidityGauge.symbol;
};

const determineChain = async (gauge: string): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges`,
      {
        query: `{
          rootGauge(where: {id: "${gauge.toLowerCase()}"}) {
            chain
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data.data.rootGauge) return;
  return res.data.data.rootGauge.chain;
};

const getSymbolFromLiquidityGauge = async (gauge: string): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges`,
      {
        query: `{
          liquidityGauge(where: {id: "${gauge.toLowerCase()}"}) {
            symbol
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data.data.liquidityGauge) return;
  return res.data.data.liquidityGauge.symbol;
};

const getRecipient = async (gauge: string) => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges`,
      {
        query: `{
          rootGauge(where: {id: "${gauge.toLowerCase()}"}) {
            recipient
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data.data.rootGauge) return;
  return res.data.data.rootGauge.recipient;
};

const getSymbolFromRootGauge = async (gauge: string): Promise<string | undefined> => {
  // Get the pool address
  const recipient = await getRecipient(gauge);
  if (!recipient) return;

  // Determine the chain
  const chain = await determineChain(gauge);
  if (!chain) return;

  // Get the pool address
  const symbol = await getSymbol(recipient, chain);
  return symbol;
};

const getSymbolFromBalancerGauge = async (gauge: string): Promise<string> => {
  const mainetSymbol = await getSymbolFromLiquidityGauge(gauge);
  if (mainetSymbol) return mainetSymbol;

  const altSymbol = await getSymbolFromRootGauge(gauge);
  if (altSymbol) return altSymbol;

  return '';
};

const getSymbolFromCurveGauge = async (gauge: string): Promise<string> => {
  let symbol: string = '';

  try {
    const gaugeContract = new Contract(gauge, CurveGaugeAbi, etherProvider);
    const lpAddress = await gaugeContract.lp_token();

    const lpContract = new Contract(lpAddress, ERC20, etherProvider);
    symbol = await lpContract.symbol();
  } catch (e) {
    console.error(e);
  }
  return symbol;
};

const getSymbolFromGauge = async (gauge: string, protocol: ProtocolType): Promise<string> => {
  switch (protocol) {
    case ProtocolType.Balancer:
      return getSymbolFromBalancerGauge(gauge);
    case ProtocolType.Curve:
      return getSymbolFromCurveGauge(gauge);
    default:
      return '';
  }
};

export default getSymbolFromGauge;
