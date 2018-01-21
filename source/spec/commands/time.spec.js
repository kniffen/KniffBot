const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')
const time = require('../../lib/commands/time.js')

chai.use(spies)

describe('commands/time()', () => {

  const date = {
    now: () => 100
  }

  const state = {
    timezone: 'foo',
    timeformat: 'bar'
  }

  const format = chai.spy(() => 'foobar')
  const tz = chai.spy(() => ({format}))
  const moment = {tz}
  
  const json = chai.spy(async () => ({
    results: [{
      geometry: {
        location: {
          lat: 1,
          lng: 2
        }
      }
    }],
    timeZoneId: 'qux'
  }))

  const fetch = chai.spy(async () => ({json}))


  it('should return the current time', async () => {
    const message = await time({args: []}, date, state, moment, fetch)

    expect(tz).to.have.been.called.with('foo')
    expect(format).to.have.been.called.with('bar')
    expect(message).to.deep.equal({
      args: [],
      isCode: true,
      output: 'foobar'
    })
  })

  it('should return the time for a given location', async () => {
    const message = await time({args: ['london', 'uk']}, date, state, moment, fetch)

    expect(fetch).to.have.been.called.with('http://maps.googleapis.com/maps/api/geocode/json?address=london%20uk')
    expect(json).to.have.been.called()
    expect(fetch).to.have.been.called.with('https://maps.googleapis.com/maps/api/timezone/json?location=1,2&timestamp=0&sensor=false')
    expect(tz).to.have.been.called.with(100, 'qux')
    expect(format).to.have.been.called.with('bar')
    expect(message).to.deep.equal({
      args: ['london', 'uk'],
      isCode: true,
      output: 'foobar qux'
    })
  })

})