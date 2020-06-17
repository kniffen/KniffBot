/**
  * Error event handler/callback
  */

import log from "../utils/log"

export default function errorEventHandler(label, err) {

  if (!err || !err.message) return

  console.log(err)

  log({label, message: err.message})

}