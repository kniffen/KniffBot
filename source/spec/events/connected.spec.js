const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')

chai.use(spies)

const connected = require('../../lib/events/connected.js')

describe('events/connected()', () => {
  let state

  const env = {
    TWITCH_CHANNEL: 'foobar',
    TWITCH_IRC_USERNAME: 'barfoo'
  }

  const log = chai.spy()

  const join = chai.spy()

  const services = {
    discord: {
      user: {
        username: 'barfoo'
      }
    },
    twitchIRC: {
      channel: chai.spy(() => ({join}))
    }
  }

  beforeEach(() => {
    state = {
      discord: {online: false},
      twitchIRC: {online: false}
    }
  })

  it('should handle Discord connections', () => {
    connected('discord', env, log, services, state)

    expect(log).to.have.been.called.with('discord connected')
    expect(state.discord).to.be.deep.equal({
      online: true,
      username: 'barfoo'
    })
  })

  it('should handle Twitch IRC connections', () => {
    connected('twitchIRC', env, log, services, state)

    expect(log).to.have.been.called.with('twitchIRC connected')
    expect(state.twitchIRC).to.be.deep.equal({
      online: true,
      username: 'barfoo'
    })
    expect(services.twitchIRC.channel).to.have.been.called.with('#foobar')
    expect(join).to.have.been.called()
  })
})