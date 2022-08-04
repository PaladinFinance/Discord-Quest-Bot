import setDataFromArgs from './listener/discord/setDataFromArgs';
import setInteractionChannel from './listener/discord/setInteractionChannel';
import setTargetChannel from './listener/discord/setTargetChannel';
import createEtherEventListener from './scripts/createEtherEventListener';
import QuestBoardAbi from './data/QuestBoardAbi.json';
import questCreationListener from './listener/ethers/questCreationListener';

setInteractionChannel();
setTargetChannel();
setDataFromArgs(['veBALQuestBoardContractAddress'], '!setBalancerContractAddress');
setDataFromArgs(['veCRVQuestBoardContractAddress'], '!setCurverContractAddress');
createEtherEventListener(
  '0xA6Ed52EB3e39891CE5029817CdB5eAc97A2834B3',
  QuestBoardAbi,
  'QuestCreated',
  questCreationListener,
);
