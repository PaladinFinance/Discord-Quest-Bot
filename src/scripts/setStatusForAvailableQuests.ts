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

    const balQuestsNb = await getAvailableQuestsForPeriod(data.veBALQuestBoardContractAddress);
    const crvQuestsNb = await getAvailableQuestsForPeriod(data.veCRVQuestBoardContractAddress);
    setBotStatus(`${crvQuestsNb} CRV / ${balQuestsNb} BAL Quests`);
  } catch (err) {
    console.error(err);
  }
};

export default setStatusForAvailableQuests;
