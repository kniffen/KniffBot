const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')

chai.use(spies)

const chatMessage = require('../../lib/events/chat-message.js')

describe('events/chatMessage()', () => {
  const services = {
    cleverbot: {
      write: chai.spy((input, cb) => cb({message: 'hi'}))
    }
  }

  // const state = {
  //   foobar: {
  //     username: 'barfoo'
  //   },
  //   commands: {
  //     foo: 'bar',
  //     bar: async message => Object.assign(message, {output: 'baz'})
  //   }
  // }

  const commands = {
    foo: 'bar',
    bar: async message => Object.assign(message, {output: 'baz'})
  }

  const sendMessage = chai.spy()

  it('should run static commands', async () => {
    const parseMessage = chai.spy(() => ({
      input: '!foo',
      command: 'foo'
    }))

    await chatMessage('foobar', {}, services, commands, parseMessage, sendMessage)

    expect(parseMessage).to.have.been.called.with('foobar', {})
    expect(sendMessage).to.have.been.called.with({
      input: '!foo',
      command: 'foo',
      output: 'bar'
    })
  })

  it('should run logic commands', async () => {
    const parseMessage = chai.spy(() => ({
      input: '!bar',
      command: 'bar'
    }))

    await chatMessage('foobar', {}, services, commands, parseMessage, sendMessage)

    expect(parseMessage).to.have.been.called.with('foobar', {})    
    expect(sendMessage).to.have.been.called.with({
      input: '!bar',
      command: 'bar',
      output: 'baz'
    })
  })

  it('should handle bot being mentioned', async () => {
    const parseMessage = chai.spy(() => ({
      input: '@barfoo hello',
      self: {username: 'barfoo'}
    }))

    await chatMessage('foobar', {}, services, commands, parseMessage, sendMessage)

    expect(parseMessage).to.have.been.called.with('foobar', {})
    expect(services.cleverbot.write).to.have.been.called.with('hello')
    expect(sendMessage).to.have.been.called.with({
      input: '@barfoo hello',
      output: 'hi',
      isReply: true,
      self: {username: 'barfoo'}
    })
  })

})