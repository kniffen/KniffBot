'use strict';

var _require = require('chai'),
    expect = _require.expect;

var weather = require('../../lib/commands/weather.js');

describe('commands/weather()', function () {

  var weatherjs = {
    find: function find(opts, cb) {
      var data = [{
        location: {
          name: 'foobar'
        },
        current: {
          temperature: 0,
          skytext: 'skytext',
          feelslike: 1,
          winddisplay: 'winddisplay'
        },
        forecast: [{}, {
          high: 1,
          low: 0,
          skytextday: 'skytextday',
          precip: 'precip'
        }]
      }];

      cb(undefined, data);
    }
  };

  it('should return the weather for a given location', async function () {
    var message = await weather({ args: ['foo', 'bar'] }, weatherjs);

    expect(message).to.deep.equal({
      args: ['foo', 'bar'],
      isCode: true,
      output: '**foobar right now:**\n0\xB0C/32\xB0F skytext feels like 1\xB0C/33.8\xB0F winddisplay wind\n**Forecast for tomorrow:**\nHigh: 1\xB0C/33.8\xB0F, low: 0\xB0C/32\xB0F skytextday with precip% chance precip.'
    });
  });

  it('should return a specific error string if missing arguments', async function () {
    var message = await weather({ args: [] }, weatherjs);

    expect(message).to.deep.equal({
      args: [],
      output: 'Missing arguments, use !weather [location]'
    });
  });
});