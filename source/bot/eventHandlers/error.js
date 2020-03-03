/**
  * Error event handler/callback
  */

import log from "../../bot/utils/log"

export default function errorEventHandler(label, message) {

  log({label, message, isError: true})

}