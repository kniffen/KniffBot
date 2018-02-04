const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')
const nextEvent = require('../../lib/commands/nextevent.js')

chai.use(spies)

describe('commands/nextEvent()', () => {
  let state

  const updateEvents = chai.spy()

  beforeEach(() => {
    state = {
      events: []
    }
  })

  it('should return the time until the next event', async () => {

    state.events = [
      {
        timestamp: 2000,
        name: 'foo',
        description: 'bar',
        location: 'baz'
      }
    ]

    const message = await nextEvent({timestamp: 100}, state, updateEvents)

    expect(updateEvents).to.have.been.called()
    expect(message).to.deep.equal({
      timestamp: 100,
      output: 'foo starts in 1d 7h 40m\nbar\nbaz'
    })

  })

  it('should return a specific error string if there are no upcoming events', async () => {
    const message = await nextEvent({timestamp: 100}, state, updateEvents)

    expect(updateEvents).to.have.been.called()
    expect(message).to.deep.equal({
      timestamp: 100,
      output: 'There are currently no scheduled events'
    })

  })

})