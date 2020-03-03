/**
  * Save profiles object to a JSON file
  *
  * TODO
  * - Write a "save file" function to use for this and the ability to save settings/options
  */

import path from "path"
import fs   from "fs"

import log from "./log"

export default function saveProfiles(bot) {

  log({
    message: "Saving profiles"
  })

  const filePath = path.resolve(__dirname, "../../../profiles.json")
  fs.writeFileSync(filePath, JSON.stringify(bot.profiles, null, 3))
  
}