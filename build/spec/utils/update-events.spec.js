'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('chai'),
    expect = _require.expect;

var updateEvents = require('../../lib/utils/update-events.js');

describe('utils/updateEvents()', function () {

  var env = {
    GOOGLE_CALENDAR_ID: '',
    GOOGLE_CALENDAR_APIKEY: ''
  };

  var state = {
    events: []
  };

  var fetch = async function fetch() {
    return {
      json: async function json() {
        return {
          items: [{
            start: {
              dateTime: 100
            },
            summary: 'foobar',
            description: 'foo',
            location: 'bar'
          }, {
            start: {
              date: 200
            },
            summary: 'barfoo',
            description: 'baz',
            location: 'qux'
          }]
        };
      }
    };
  };

  var Date = function Date(time) {
    var _this = this;

    _classCallCheck(this, Date);

    this.time = time;
    this.getTime = function () {
      return _this.time;
    };
  };

  it('should update the state with new events', async function () {

    await updateEvents(env, state, fetch, Date);

    expect(state.events).to.deep.equal([{
      timestamp: 100,
      name: 'foobar',
      description: 'foo',
      location: 'bar'
    }, {
      timestamp: 200,
      name: 'barfoo',
      description: 'baz',
      location: 'qux'
    }]);
  });
});