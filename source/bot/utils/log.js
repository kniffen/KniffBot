/**
  * Custom log function
  *
  * TODO
  * - Store logs in a file
  * - Improve output method
  */

import moment from "moment-timezone"

export default function log({ label, message }) {

  console.log(`[${label || "SYSTEM"}] ${moment.utc().format("YYYY-MM-DD HH:mm:ss z")}: ${message}`)

}