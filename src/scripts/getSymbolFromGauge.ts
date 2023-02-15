import { Contract } from 'ethers';
import etherProvider from '../config/etherProvider';
import erc20 from '../data/abi/erc20.json';
import gaugeRootAbi from '../data/abi/gaugeRootAbi.json';
import axios from 'axios';

type Chain = 'Polygon' | 'Optimism' | 'Arbitrum';

const getSymbol = async (recipient: string, chain: Chain): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-${chain.toLowerCase()}`,
      {
        query: `{
          liquidityGauges(where: {streamer: "${recipient}"}) {
            symbol
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data.data.liquidityGauges[0]) return;
  return res.data.data.liquidityGauges[0].symbol;
};

const determineChain = async (gauge: string): Promise<Chain | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges`,
      {
        query: `{
          rootGauges(where: {id: "${gauge.toLowerCase()}"}) {
            chain
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data.data.rootGauges[0]) return;
  return res.data.data.rootGauges[0].chain;
};

const getSymbolFromRootGauge = async (gauge: string): Promise<string | undefined> => {
  // Get the pool address
  let recipient: string;
  try {
    const gaugeRootContract = new Contract(gauge, gaugeRootAbi, etherProvider);
    recipient = await gaugeRootContract.getRecipient();
  } catch (e) {
    console.error(e);
    return;
  }

  // Determine the chain
  const chain = await determineChain(gauge);
  if (!chain) return;

  // Get the pool address
  const symbol = await getSymbol(recipient, chain);
  return symbol;
};

const getSymbolFromGauge = async (gauge: string): Promise<string> => {
  let symbol: string = '';

  try {
    const gaugeContract = new Contract(gauge, erc20, etherProvider);
    symbol = await gaugeContract.symbol();
  } catch (e) {
    const expectedSymbol = await getSymbolFromRootGauge(gauge);
    if (expectedSymbol) symbol = expectedSymbol;
  }
  return symbol;
};

export default getSymbolFromGauge;
