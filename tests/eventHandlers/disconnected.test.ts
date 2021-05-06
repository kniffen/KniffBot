import * as assert from 'assert'
import * as sinon from 'sinon'

import * as discord from '../../src/services/discord'

import disconnectedEventHandler from '../../src/eventHandlers/disconnected'

describe('eventHandlers/disconnectedEventHandler()', function() {

  let log: any

  before(function() {
    log = sinon.stub(console, 'log')
  })

  after(function(): void {
    log.restore()
  })

  afterEach(function(): void {
    log.resetHistory()
  })

  it('Should log disconnection events', function() {
    disconnectedEventHandler()
    disconnectedEventHandler('')
    disconnectedEventHandler('foobar')

    assert.deepEqual(log.args, [
      ['UNKNOWN: disconnected'],
      ['UNKNOWN: disconnected'],
      ['FOOBAR: disconnected'],
    ])
  })

  describe('Discord', function() {
    let login: any

    before(function() {
      login =
        sinon
          .stub(discord.default, 'login')
          .callsFake((token) => Promise.resolve('success'))
    })

    after(function() {
      login.restore()
    })

    it('Should attempt to reconnect', function() {
      disconnectedEventHandler('discord')

      assert.deepEqual(login.args, [[process.env.DISCORD_TOKEN]])
    })
  })
})