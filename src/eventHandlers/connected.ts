import twitchIRC from '../services/twitchIRC'

export default function connectedEventHandler(serviceName: string = '') {

  const label = serviceName ? `${serviceName.toUpperCase()}:` : 'UNKNOWN:'

  if ( serviceName === 'twitchIRC' ) {
    const channel = twitchIRC.channel('#'+process.env.TWITCH_CHANNEL)
    channel.join()
    console.log(`${label} connected`)
  
  } else {
    console.log(`${label} connected`)

  }

}