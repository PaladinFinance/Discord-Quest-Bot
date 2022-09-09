import getAvailableQuestsForPeriod from './getAvailableQuestsForPeriod';
import setBotStatus from './setBotStatus';
import fs from 'fs';

const setStatusForAvailableQuests = async () => {
  try {
    const data = JSON.parse(
      fs.readFileSync('./src/data/data.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );

    const balQuestsNb = getAvailableQuestsForPeriod(data.veBALQuestBoardContractAddress);
    const crvQuestsNb = getAvailableQuestsForPeriod(data.veCRVQuestBoardContractAddress);

    const questsNb = await Promise.all([crvQuestsNb, balQuestsNb]);
    setBotStatus(`${questsNb[0]} CRV / ${questsNb[1]} BAL Quests`);
  } catch (err) {
    console.error(err);
  }
};

export default setStatusForAvailableQuests;
