import client from '../config/discordClient';

const setBotStatus = (msg: string) => {
  if (!client) return;
  try {
    client.user?.setActivity(msg);
  } catch (err) {
    console.error(err);
  }
};

export default setBotStatus;
