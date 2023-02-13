import createEtherEventListener from './scripts/createEtherEventListener';
import QuestBoardAbi from './data/abi/QuestBoardAbi.json';
import questCreationListener from './listener/ethers/questCreationListener';
import data from './data/data.json';
import cron from 'node-cron';
import { ProtocolType } from './scripts/getProtocolEmbed';
import setStatusForAvailableQuests from './scripts/setStatusForAvailableQuests';
import getSymbolFromGauge from './scripts/getSymbolFromGauge';

getSymbolFromGauge("0xF0d887c1f5996C91402EB69Ab525f028DD5d7578");