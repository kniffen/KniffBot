'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');
var time = require('../../lib/commands/time.js');

chai.use(spies);

describe('commands/time()', function () {

  var date = {
    now: function now() {
      return 100;
    }
  };

  var state = {
    timezone: 'foo',
    timeformat: 'bar'
  };

  var format = chai.spy(function () {
    return 'foobar';
  });
  var tz = chai.spy(function () {
    return { format: format };
  });
  var moment = { tz: tz };

  var json = chai.spy(async function () {
    return {
      results: [{
        geometry: {
          location: {
            lat: 1,
            lng: 2
          }
        }
      }],
      timeZoneId: 'qux'
    };
  });

  var fetch = chai.spy(async function () {
    return { json: json };
  });

  it('should return the current time', async function () {
    var message = await time({ args: [] }, date, state, moment, fetch);

    expect(tz).to.have.been.called.with('foo');
    expect(format).to.have.been.called.with('bar');
    expect(message).to.deep.equal({
      args: [],
      isCode: true,
      output: 'foobar'
    });
  });

  it('should return the time for a given location', async function () {
    var message = await time({ args: ['london', 'uk'] }, date, state, moment, fetch);

    expect(fetch).to.have.been.called.with('http://maps.googleapis.com/maps/api/geocode/json?address=london%20uk');
    expect(json).to.have.been.called();
    expect(fetch).to.have.been.called.with('https://maps.googleapis.com/maps/api/timezone/json?location=1,2&timestamp=0&sensor=false');
    expect(tz).to.have.been.called.with(100, 'qux');
    expect(format).to.have.been.called.with('bar');
    expect(message).to.deep.equal({
      args: ['london', 'uk'],
      isCode: true,
      output: 'foobar qux'
    });
  });
});