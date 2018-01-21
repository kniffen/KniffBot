'use strict';

var chai = require('chai');
var expect = chai.expect;

var spies = require('chai-spies');
var error = require('../../lib/events/error.js');

chai.use(spies);

describe('events/error()', function () {
  var log = chai.spy();

  it('should log the error message to the console', function () {
    error('foobar', 'bar foo', log);
    expect(log).to.have.been.called.with('foobar', 'bar foo');
  });
});