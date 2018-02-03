async function loadState(
  config,
  req = require,
  state = require('../state.js'),
  fs = require('fs'),
  path = require('path'),
  updateEvents = require('./update-events.js')
) {

  Object.assign(state, config)

  await updateEvents()

  fs.readdirSync(path.resolve(__dirname, '../commands'))
    .forEach(filename => {
      state.commands[filename.split('.')[0]] = req(path.resolve(__dirname, `../commands/${filename}`))
    })
}

module.exports = loadState