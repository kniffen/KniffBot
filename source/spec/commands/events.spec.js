const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')
const events = require('../../lib/commands/events.js')

chai.use(spies)

describe('commands/events', () => {
  
  const state = {
    timezone: 0,
    timeformat: 'barfoo',
    events: [
      {
        timestamp: 0,
        name: 'foo',
        description: 'bar'
      },
      {
        timestamp: 200,
        name: 'bar',
        description: 'baz'
      },
      {
        timestamp: 400,
        name: 'qux',
        description: 'foo'
      }
    ]
  }

  const moment = () => ({
    tz: () => ({
      format: () => 'foobar'
    })
  })

  const updateEvents = chai.spy()

  it('should list upcoming events', async () => {

    const message = await events({timestamp: 100}, state, moment, updateEvents)

    expect(message).to.deep.equal({
      timestamp: 100,
      output: 
`Upcoming events:

- foobar
bar
baz

- foobar
qux
foo`,
      isCode: true

    })

    expect(updateEvents).to.have.been.called()

  })
})