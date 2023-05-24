import client from '../config/discordClient';

const setBotStatus = (msg: string) => {
  try {
    client.user?.setActivity(msg);
  } catch (err) {
    console.error(err);
  }
};

export default setBotStatus;
