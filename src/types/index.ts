import DiscordJS from 'discord.js'

export interface Settings {
  readonly commandPrefix: string;
  readonly discordEmbedColor: string;
}

export interface Message {
  readonly service: string;
  input: string;
  output?: (DiscordJS.MessageEmbed | string);
  timestamp: number;
  isBot: boolean;
  isFile: boolean;
  isReply: boolean;
  isMentioned: boolean;
  author: {
    id: string,
    name: string
    isAuthorized: boolean;
  };
  command?: {
    id: string, 
    args: (string | number)[]
  };
  readonly original: any;
}

export interface Command {
  id: string;
  allowedServices: string[];
  category: string;
  args: (string | number)[][];
  isRestricted: boolean;
  run(message: Message): Promise<void>;
}