const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')

chai.use(spies)

const disconnected = require('../../lib/events/disconnected.js')

describe('events/disconnected()', () => {
  const log = chai.spy()
  
  const env = {
    DISCORD_TOKEN: 'barfoo'
  }

  const services = {
    discord: {
      login: chai.spy()
    }
  }

  const state = {
    discord: {
      online: true
    }
  }

  disconnected('discord', log, env, services, state)

  it('should log a message to the console', () => {
    expect(log).to.have.been.called.with('discord disconnected')
  })

  it('should attempt to reconnect to the service', () => {
    expect(services.discord.login).to.have.been.called.with('barfoo')
  })

  it('should update the state of the service', () => {
    expect(state.discord.online).to.be.false
  })
})