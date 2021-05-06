import discord from '../services/discord'

export default function disconnectedEventHandler(serviceName: string = '') {

  const label = serviceName ? `${serviceName.toUpperCase()}:` : 'UNKNOWN:'

  console.log(`${label} disconnected`)

  if (serviceName === 'discord') {
    discord.login(process.env.DISCORD_TOKEN)
  }

}