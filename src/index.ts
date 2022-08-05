import setInteractionChannel from './listener/discord/setInteractionChannel';
import setTargetChannel from './listener/discord/setTargetChannel';
import createEtherEventListener from './scripts/createEtherEventListener';
import QuestBoardAbi from './data/QuestBoardAbi.json';
import balancerQuestCreationListener from './listener/ethers/balancerQuestCreationListener';
import curveQuestCreationListener from './listener/ethers/curveQuestCreationListener';
import data from './data/data.json';

setInteractionChannel('!here', 'interactionChannelId', 'Paladin');
setTargetChannel('!target', 'targetChannelId');
createEtherEventListener(
  data.veBALQuestBoardContractAddress,
  QuestBoardAbi,
  'NewQuest',
  balancerQuestCreationListener,
);
createEtherEventListener(
  data.veCRVQuestBoardContractAddress,
  QuestBoardAbi,
  'NewQuest',
  curveQuestCreationListener,
);
