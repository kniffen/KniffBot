import { WolframClient } from "node-wolfram-alpha"

let wolframAlpha: any

if ( process.env.WOLFRAM_ALPHA_APP_ID ) {

  wolframAlpha = new WolframClient(process.env.WOLFRAM_ALPHA_APP_ID)
  
} else {

  throw new Error('Wolfram|Alpha: Missing app ID')

}

export default wolframAlpha