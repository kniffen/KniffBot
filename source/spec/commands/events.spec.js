const chai = require('chai')
const { expect } = chai
const events = require('../../lib/commands/events.js')

describe('commands/events', () => {
  
  const config = {
    timezone: 0,
    timeformat: 'barfoo'
  }

  const getEvents = () => [
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

  const moment = () => ({
    tz: () => ({
      format: () => 'foobar'
    })
  })

  it('should list upcoming events', async () => {

    const message = await events({timestamp: 100}, config, moment, getEvents)

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

  })
})