import * as assert from 'assert'
import * as sinon from 'sinon'

import createFakeMessage from '../test-utils/createFakeMessage'

import { Message, Command } from '../../src/types'

import cleverbot from '../../src/services/cleverbot'
import pingCommand from '../../src/commands/ping'
import * as createParsedMessage from '../../src/utils/createParsedMessage'
import * as sendMessage from '../../src/utils/sendMessage'

import messageEventHandler from '../../src/eventHandlers/message'

describe('eventHandlers/messageEventHandler()', function() {

  const sandbox = sinon.createSandbox()

  let actualMessage: Message
  let createParsedMessageStub: any
  let sendMessageStub: any
  let pingRunStub: any
  let cleverbotWriteStub: any

  before(function() {
    createParsedMessageStub =
      sandbox
        .stub(createParsedMessage, 'default')
        .callsFake(() => actualMessage)

    sendMessageStub =
      sandbox
        .stub(sendMessage, 'default')
        .callsFake((message) => { /* ignore */ })
  
    pingRunStub = sinon.spy(pingCommand, 'run')

    cleverbotWriteStub =
      sinon
        .stub(cleverbot, 'write')
        .callsFake((input, cb) => {
          cb({message: 'foo bar baz'})
        })
  })

  beforeEach(function() {
    actualMessage = createFakeMessage()
  })

  afterEach(function() {
    sandbox.resetHistory()
    pingRunStub.resetHistory()
  })

  after(function() {
    sinon.restore()
    sandbox.restore()
  })
  
  it('Should handle messages from any service', async function() {
    const original = {foo: 'bar'}

    const expectedMessage = createFakeMessage({
      original
    })

    await messageEventHandler('foobar', original)

    assert.deepEqual(createParsedMessageStub.args, [['foobar', original]])
    assert.ok(!sendMessageStub.called)
  })

  it('Should run commands', async function() {
    actualMessage.command = {id: 'ping', args: []}

    const expectedMessage = createFakeMessage({
      command: {id: 'ping', args: []},
      output: 'Pong!'
    })

    await messageEventHandler('foobar', {})

    assert.ok(pingRunStub.called)
    assert.deepEqual(sendMessageStub.args, [[expectedMessage]])
  })

  it('Should ignore messages from bots', async function() {
    actualMessage.command = {id: 'ping', args: []}
    actualMessage.isBot = true

    await messageEventHandler('foobar', {})

    assert.ok(!pingRunStub.called)
    assert.ok(!sendMessageStub.called)
  })

  it('Should ignore non existing commands', async function() {
    actualMessage.command = {id: 'foo', args: []}
    actualMessage.isBot = true

    await messageEventHandler('foobar', {})

    assert.ok(!sendMessageStub.called)
  })
  
  it('should not run restricted commands unless issued by the server owner')
  
  it('should only run commands if the service allows it')

  it('should reply to mentions with cleverbot', async function() {
    actualMessage.isMentioned = true

    const expectedMessage = createFakeMessage({
      output: 'foo bar baz',
      isMentioned: true,
      isReply: true
    })

    await messageEventHandler('foobar', {})

    assert.deepEqual(sendMessageStub.args, [[expectedMessage]])
  })
  
  it('should reply with a fallback message if cleverbot is unresponsive', async function() {
    cleverbotWriteStub.restore()

    cleverbotWriteStub =
      sinon
        .stub(cleverbot, 'write')
        .callsFake((input, cb) => {
          throw new Error('Error message that should be ignored')
        })

    actualMessage.isMentioned = true

    const expectedMessage = createFakeMessage({
      output: 'I\'m sorry, can you repeat that?',
      isMentioned: true,
      isReply: true
    })

    await messageEventHandler('foobar', {})

    assert.deepEqual(sendMessageStub.args, [[expectedMessage]])
  })

})