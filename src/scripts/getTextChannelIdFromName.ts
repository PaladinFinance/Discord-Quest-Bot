import { ChannelType, TextChannel } from 'discord.js';
import client from '../config/discordClient';

const getTextChannelIdFromName = (channelName: string): string | undefined => {
  const channels = client.channels.cache;
  let value = undefined;

  channels.forEach((channel) => {
    if (channel.type === ChannelType.GuildText && (channel as TextChannel).name === channelName) {
      value = channel.id;
    }
  });
  return value;
};

export default getTextChannelIdFromName;
