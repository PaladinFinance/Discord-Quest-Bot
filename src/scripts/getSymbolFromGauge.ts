import { Contract } from 'ethers';
import etherProvider from '../config/etherProvider';
import polygonProvider from '../config/polygonProvider';
import optimismProvider from '../config/optimismProvider';
import arbitrumProvider from '../config/arbitrumProvider';
import erc20 from '../data/abi/erc20.json';
import gaugePolygonRootAbi from '../data/abi/gaugePolygonRootAbi.json';
import gaugeOptimismRootAbi from '../data/abi/gaugeOptimismRootAbi.json';
import gaugeRootAbi from '../data/abi/gaugeRootAbi.json';
import axios from 'axios';

type Chain = 'polygon' | 'optimism' | 'arbitrum';

const getPool = async (recipient: string, chain: Chain): Promise<string | undefined> => {
  let res;
  try {
    res = await axios.post(
      `https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-gauges-${chain}`,
      {
        query: `{
          liquidityGauges(where: {streamer: "${recipient}"}) {
            pool {
              id,
            }
          }
        }`,
      },
    );
  } catch (e) {
    console.error(e);
    return;
  }
  if (!res.data.data.liquidityGauges[0]) return;
  return res.data.data.liquidityGauges[0].pool.id;
};

const determineChain = async (gauge: string): Promise<Chain> => {
  try {
    const gaugePolygonRootContract = new Contract(gauge, gaugePolygonRootAbi, etherProvider);
    await gaugePolygonRootContract.getPolygonBridge();
    return 'polygon';
  } catch (e) {
    console.error(gauge);
  }

  try {
    const gaugeOptimismRootContract = new Contract(gauge, gaugeOptimismRootAbi, etherProvider);
    await gaugeOptimismRootContract.getOptimismBridge();
    return 'optimism';
  } catch (e) {}

  return 'arbitrum';
};

const getSymbolFromRootGauge = async (gauge: string): Promise<string | undefined> => {
  let symbol: string = '';
  let recipient: string;

  // Get the pool address
  try {
    const gaugeRootContract = new Contract(gauge, gaugeRootAbi, etherProvider);
    recipient = await gaugeRootContract.getRecipient();
  } catch (e) {
    console.error(e);
    return;
  }

  const chain = await determineChain(gauge);

  const pool = await getPool(recipient, chain);
  if (!pool) return '';

  // Get the symbol
  try {
    switch (chain) {
      case 'polygon':
        const poolPolygonContract = new Contract(pool, erc20, polygonProvider);
        symbol = await poolPolygonContract.symbol();
        break;
      case 'optimism':
        const poolOptimismContract = new Contract(pool, erc20, optimismProvider);
        symbol = await poolOptimismContract.symbol();
        break;
      case 'arbitrum':
        const poolArbitrumContract = new Contract(pool, erc20, arbitrumProvider);
        symbol = await poolArbitrumContract.symbol();
        break;
      default:
        break;
    }
  } catch (e) {
    console.error(e);
  }
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
