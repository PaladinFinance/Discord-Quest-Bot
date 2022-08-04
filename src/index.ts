import setInteractionChannel from './listener/discord/setInteractionChannel';
import setTargetChannel from './listener/discord/setTargetChannel';
import createEtherEventListener from './scripts/createEtherEventListener';
import QuestBoardAbi from './data/QuestBoardAbi.json';
import questCreationListener from './listener/ethers/questCreationListener';
import data from './data/data.json';

setInteractionChannel('!here', 'interactionChannelId', 'wow');
setTargetChannel('!target', 'targetChannelId');
createEtherEventListener(
  data.veBALQuestBoardContractAddress,
  QuestBoardAbi,
  'NewQuest',
  questCreationListener,
);
createEtherEventListener(
  data.veCRVQuestBoardContractAddress,
  QuestBoardAbi,
  'NewQuest',
  questCreationListener,
);
