'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');
var events = require('../../lib/commands/events.js');

chai.use(spies);

describe('commands/events', function () {

  var state = {
    timezone: 0,
    timeformat: 'barfoo',
    events: [{
      timestamp: 0,
      name: 'foo',
      description: 'bar'
    }, {
      timestamp: 200,
      name: 'bar',
      description: 'baz'
    }, {
      timestamp: 400,
      name: 'qux',
      description: 'foo'
    }]
  };

  var moment = function moment() {
    return {
      tz: function tz() {
        return {
          format: function format() {
            return 'foobar';
          }
        };
      }
    };
  };

  var updateEvents = chai.spy();

  it('should list upcoming events', async function () {

    var message = await events({ timestamp: 100 }, state, moment, updateEvents);

    expect(message).to.deep.equal({
      timestamp: 100,
      output: 'Upcoming events:\n\n- foobar\nbar\nbaz\n\n- foobar\nqux\nfoo',
      isCode: true

    });

    expect(updateEvents).to.have.been.called();
  });
});