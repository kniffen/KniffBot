const { expect } = require('chai')
const ping = require('../../lib/commands/ping.js')

describe('commands/ping()', () => {
  const date = {
    now: () => 150
  }

  it('should return the current ping time to the service', async () => {
    const message = await ping({timestamp: 50}, date)

    expect(message).to.deep.equal({
      timestamp: 50,
      output: '100ms'
    })
  })

})