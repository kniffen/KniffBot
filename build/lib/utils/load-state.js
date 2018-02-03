'use strict';

async function loadState(config) {
  var req = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require;
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require('../state.js');
  var fs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : require('fs');
  var path = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : require('path');
  var updateEvents = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : require('./update-events.js');


  Object.assign(state, config);

  await updateEvents();

  fs.readdirSync(path.resolve(__dirname, '../commands')).forEach(function (filename) {
    state.commands[filename.split('.')[0]] = req(path.resolve(__dirname, '../commands/' + filename));
  });
}

module.exports = loadState;