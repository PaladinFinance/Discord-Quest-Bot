import { Message } from 'discord.js';

const checkHasRole = (message: Message, roleName: string): boolean => {
  const targetRole = message.guild!.roles.cache.find((role) => role.name === roleName);
  if (!targetRole) {
    return false;
  }
  return message.member!.roles.cache.has(targetRole.id);
};

export default checkHasRole;
