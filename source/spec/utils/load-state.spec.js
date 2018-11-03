const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')
const loadState = require('../../lib/utils/load-state.js')

chai.use(spies)

describe('utils/loadState()', () => {
  const config = {
    timezone: 'foobar',
    timeformat: 'barfoo',
    commands: {
      foo: 'bar'
    }
  }

  const req = () => 'foobar'

  const state = {
    events: [],
    discord: {
      online: false
    },
    twitchIRC: {
      online: false
    }
  }

  const fs = {
    readdirSync: () => ['bar.js', 'baz.js']
  }

  const path = {
    resolve: () => undefined
  }

  loadState(config, req, state, fs, path)

  it('should load config.json into the state', () => {
    expect(state).to.deep.equal({
      timezone: 'foobar',
      timeformat: 'barfoo',
      events: [],
      discord: {
        online: false
      },
      twitchIRC: {
        online: false
      },
      commands: {
        foo: 'bar',
        bar: 'foobar',
        baz: 'foobar'
      }
    })
  })
})