import client from '../config/client';

const setBotStatus = (msg: string) => {
  try {
    client.user?.setActivity(msg);
  } catch (err) {
    console.error(err);
  }
};

export default setBotStatus;
