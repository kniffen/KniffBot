const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')
const time = require('../../lib/commands/time.js')

chai.use(spies)

describe('commands/time()', () => {

  const state = {
    timezone: 'foo',
    timeformat: 'bar'
  }

  const format = chai.spy(() => 'foobar')
  const tz = chai.spy(() => ({format}))
  const moment = {tz}

  it('should return the current time', async () => {
    const message = await time({args: []}, state, moment)

    expect(tz).to.have.been.called.with('foo')
    expect(format).to.have.been.called.with('bar')
    expect(message).to.deep.equal({
      args: [],
      isCode: true,
      output: 'foobar'
    })
  })

  it('should return the time for a given location')

})