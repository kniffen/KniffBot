const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')
const error = require('../../lib/events/error.js')

chai.use(spies)

describe('events/error()', () => {
  const log = chai.spy()

  it('should log the error message to the console', () => {
    error('foobar', 'bar foo', log)
    expect(log).to.have.been.called.with('foobar', 'bar foo')
  })
})