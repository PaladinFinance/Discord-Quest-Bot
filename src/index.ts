import createEtherEventListener from './scripts/createEtherEventListener';
import QuestBoardAbi from './data/abi/QuestBoardAbi.json';
import questCreationListener from './listener/ethers/questCreationListener';
import data from './data/data.json';
import cron from 'node-cron';
import { ProtocolType } from './scripts/getProtocolEmbed';
import setStatusForAvailableQuests from './scripts/setStatusForAvailableQuests';

createEtherEventListener(
  data.veBALQuestBoardContractAddress,
  QuestBoardAbi,
  'NewQuest',
  questCreationListener(ProtocolType.Balancer),
);
createEtherEventListener(
  data.veCRVQuestBoardContractAddress,
  QuestBoardAbi,
  'NewQuest',
  questCreationListener(ProtocolType.Curve),
);

cron.schedule('0 0 * * 4', async () => {
  await setStatusForAvailableQuests();
});
