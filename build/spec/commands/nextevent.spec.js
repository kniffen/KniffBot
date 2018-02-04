'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');
var nextEvent = require('../../lib/commands/nextevent.js');

chai.use(spies);

describe('commands/nextEvent()', function () {
  var state = void 0;

  var updateEvents = chai.spy();

  beforeEach(function () {
    state = {
      events: []
    };
  });

  it('should return the time until the next event', async function () {

    state.events = [{
      timestamp: 2000,
      name: 'foo',
      description: 'bar',
      location: 'baz'
    }];

    var message = await nextEvent({ timestamp: 100 }, state, updateEvents);

    expect(updateEvents).to.have.been.called();
    expect(message).to.deep.equal({
      timestamp: 100,
      output: 'foo starts in 1d 7h 40m\nbar\nbaz'
    });
  });

  it('should return a specific error string if there are no upcoming events', async function () {
    var message = await nextEvent({ timestamp: 100 }, state, updateEvents);

    expect(updateEvents).to.have.been.called();
    expect(message).to.deep.equal({
      timestamp: 100,
      output: 'There are currently no scheduled events'
    });
  });
});