'use strict';

async function cat(message) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : require('node-fetch');

  var obj = await fetch('http://random.cat/meow').then(function (res) {
    return res.json();
  });

  message.output = obj.file ? obj.file : 'http://i.imgur.com/Bai6JTL.jpg';
  message.isFile = true;

  return message;
}

module.exports = cat;