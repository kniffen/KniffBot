/**
  * Connection event handler/callback
  */

import log from "../../bot/utils/log"

export default function connectedEventHandler(id) {

  log({
    label: id,
    message: "connected", 
  })

}