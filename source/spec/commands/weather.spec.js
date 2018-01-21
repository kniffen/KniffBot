const { expect } = require('chai')
const weather = require('../../lib/commands/weather.js')

describe('commands/weather()', () => {

  const weatherjs = {
    find: (opts, cb) => {
      const data = [{
        location: {
          name: 'foobar'
        },
        current: {
          temperature: 0,
          skytext: 'skytext',
          feelslike: 1,
          winddisplay: 'winddisplay'
        },
        forecast: [
          {},
          {
            high: 1,
            low: 0,
            skytextday: 'skytextday',
            precip: 'precip'
          }
        ]
      }]

      cb(undefined, data)
    }
  }

  it('should return the weather for a given location', async () => {
    const message = await weather({args: ['foo', 'bar']}, weatherjs)

    expect(message).to.deep.equal({
      args: ['foo', 'bar'],
      isCode: true,
      output: 
`**foobar right now:**
0°C/32°F skytext feels like 1°C/33.8°F winddisplay wind
**Forecast for tomorrow:**
High: 1°C/33.8°F, low: 0°C/32°F skytextday with precip% chance precip.`
    })
  })

  it('should return a specific error string if missing arguments', async () => {
    const message = await weather({args: []}, weatherjs)

    expect(message).to.deep.equal({
      args: [],
      output: 'Missing arguments, use !weather [location]'
    })
  })

})