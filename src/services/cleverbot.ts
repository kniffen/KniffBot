const Cleverbot = require('cleverbot-node')

let cleverbot: any

if ( process.env.CLEVERBOT_API_KEY ) {

  cleverbot = new Cleverbot()

} else {

  throw new Error('Cleverbot: Missing API key')

}

export default cleverbot