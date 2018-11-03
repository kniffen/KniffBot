const path   = require('path')
const fs     = require('fs')
const config = require('../../config.json')

const commands = {}

Object.assign(commands, config.commands)

fs.readdirSync(path.resolve(__dirname, './commands'))
  .forEach(filename => {
    commands[filename.split('.')[0]] = require(path.resolve(__dirname, `./commands/${filename}`))
  })

module.exports = commands