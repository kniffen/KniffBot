import path from 'path'
import fs from 'fs'

import { Settings } from './types'

const filePath = path.resolve(__dirname, process.env.NODE_ENV ? '../settings.dev.json' : '../settings.json')
const settings: Settings = JSON.parse(fs.readFileSync(filePath, 'utf8'))

export default settings