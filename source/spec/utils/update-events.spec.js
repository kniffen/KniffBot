const { expect } = require('chai')
const updateEvents = require('../../lib/utils/update-events.js')

describe('utils/updateEvents()', () => {

  const env = {
    GOOGLE_CALENDAR_ID: '',
    GOOGLE_CALENDAR_APIKEY: ''
  }

  const state = {
    events: []
  }

  const fetch = async () => ({
    json: async () => ({
      items: [
        {
          start: {
            dateTime: 100
          },
          summary: 'foobar',
          description: 'foo',
          location: 'bar'
        },
        {
          start: {
            date: 200
          },
          summary: 'barfoo',
          description: 'baz',
          location: 'qux'
        }
      ]
    })
  })

  class Date {
    constructor(time) {
      this.time = time
      this.getTime = () => this.time
    }
  }

  it('should update the state with new events', async () => {

    await updateEvents(env, state, fetch, Date)

    expect(state.events).to.deep.equal([
      {
        timestamp: 100,
        name: 'foobar',
        description: 'foo',
        location: 'bar'
      },
      {
        timestamp: 200,
        name: 'barfoo',
        description: 'baz',
        location: 'qux'
      }
    ])
  })

})