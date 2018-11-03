const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')

chai.use(spies)

const connected = require('../../lib/events/connected.js')

describe('events/connected()', () => {
  const env = {
    TWITCH_CHANNEL: 'foobar',
    TWITCH_IRC_USERNAME: 'barfoo'
  }

  const log = chai.spy()

  const join = chai.spy()

  const services = {
    twitchIRC: {
      channel: chai.spy(() => ({join}))
    }
  }


  it('should handle Discord connections', () => {
    connected('discord', env, log, services)
    expect(log).to.have.been.called.with('discord connected')
  })

  it('should handle Twitch IRC connections', () => {
    connected('twitchIRC', env, log, services)

    expect(log).to.have.been.called.with('twitchIRC connected')
    expect(services.twitchIRC.channel).to.have.been.called.with('#foobar')
    expect(join).to.have.been.called()
  })
})