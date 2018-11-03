const { expect } = require('chai')
const getEvents = require('../../lib/utils/get-events.js')

describe('utils/getEvents()', () => {

  const env = {
    GOOGLE_CALENDAR_ID: '',
    GOOGLE_CALENDAR_APIKEY: ''
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

  it('should get a parsed list of events', async () => {

    const events = await getEvents(env, fetch, Date)

    expect(events).to.deep.equal([
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