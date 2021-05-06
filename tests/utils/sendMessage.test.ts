import * as assert from 'assert'
import * as sinon from 'sinon'

import createFakeMessage from '../test-utils/createFakeMessage'

import twitchIRC from '../../src/services/twitchIRC'
import sendMessage from '../../src/utils/sendMessage'

describe('utils/sendMessage()', function() {
  
  let discordChannelSendSpy: any
  let discordReplySpy: any
  let twitchChannelSaySpy: any
  let twitchChannelStub: any

  before(function() {
    discordChannelSendSpy = sinon.spy()
    discordReplySpy = sinon.spy()
    twitchChannelSaySpy = sinon.spy()
    twitchChannelStub = sinon.stub(twitchIRC, 'channel').callsFake(() => ({say: twitchChannelSaySpy}))
  })

  after(function() {
    sinon.reset()
  })

  afterEach(function() {
    sinon.resetHistory()
  })

  it('should send Discord messages', function() {
    const message = createFakeMessage({
      service: 'discord',
      output: 'bar',
      original: {
        channel: {
          send: discordChannelSendSpy
        },
        reply: discordReplySpy
      }
    })

    sendMessage(message)

    message.isFile = true
    sendMessage(message)

    message.isFile = false
    message.isReply = true
    sendMessage(message)

    assert.deepEqual(discordChannelSendSpy.args, [['bar'], ['', {files: ['bar']}]])
    assert.deepEqual(discordReplySpy.args, [['bar']])
  })
  
  it('should send Twitch IRC messages', function() {
    const message = createFakeMessage({
      service: 'twitchIRC',
      output: 'bar',
    })

    sendMessage(message)

    message.isReply = true
    sendMessage(message)

    assert.deepEqual(twitchChannelStub.args, [['#twitch_channel'], ['#twitch_channel']])
    assert.deepEqual(twitchChannelSaySpy.args, [['bar'], ['@AuthorName bar']])
  })

})
