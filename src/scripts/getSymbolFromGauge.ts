import axios from 'axios';
import { ProtocolType } from '../type/protocolType';
import { getAddress } from 'ethers';
import ERC20 from '../data/abi/ERC20.json';
import BunniGauge from '../data/abi/BunniGauge.json';
import { Contract } from 'ethers';
import provider from '../config/etherProvider';

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
