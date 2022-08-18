import createEtherEventListener from './scripts/createEtherEventListener';
import QuestBoardAbi from './data/abi/QuestBoardAbi.json';
import questCreationListener from './listener/ethers/questCreationListener';
import data from './data/data.json';
import { ProtocolType } from './scripts/getProtocolEmbed';

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
