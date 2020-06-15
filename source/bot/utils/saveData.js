import path from "path"
import fs   from "fs"

import log from "./log"

export default function saveData(data) {

  log({
    message: "Saving data"
  })

  const filePath = path.resolve(__dirname, "../../../data.json")
  fs.writeFileSync(filePath, JSON.stringify(data, null, 3))
  
}