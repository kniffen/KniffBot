/**
  * Connection event handler/callback
  */

import log from "../utils/log"
import * as inspector from "../utils/inspector"

export default async function connectedEventHandler(id, bot) {

  log({
    label: id,
    message: "connected", 
  })

  clearInterval(inspector.intervals[id])

  inspector.default(id, bot)
  inspector.intervals[id] = setInterval(() => inspector.default(id, bot), 8.64e+7)

}