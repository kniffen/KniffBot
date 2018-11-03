async function loadState(
  config,
  req = require,
  state = require('../state.js'),
  fs = require('fs'),
  path = require('path')
) {

  Object.assign(state, config)

  fs.readdirSync(path.resolve(__dirname, '../commands'))
    .forEach(filename => {
      state.commands[filename.split('.')[0]] = req(path.resolve(__dirname, `../commands/${filename}`))
    })
}

module.exports = loadState