const { expect } = require('chai')
const parseMessage = require('../../lib/utils/parse-message.js')

describe('utils/parseMessage()', () => {

  it('should parse Discord messages', () => {
    const message = parseMessage('discord', {
      cleanContent: '!Foo Bar Baz',
      createdTimestamp: 1234,
      id: 4321,
      author: {
        id: 5678,
        username: 'FooBar'
      },
      channel: {},
      reply: {}
    })

    expect(message).to.deep.equal({
      serviceID: 'discord',
      id: 4321,
      input: '!Foo Bar Baz',
      args: ['Bar', 'Baz'],
      command: 'foo',
      author: {
        id: 5678,
        username: 'FooBar'
      },
      timestamp: 1234,
      fullMessage: {
        cleanContent: '!Foo Bar Baz',
        createdTimestamp: 1234,
        id: 4321,
        author: {
          id: 5678,
          username: 'FooBar'
        },
        channel: {},
        reply: {}
      }
    })
  })

  it('should parse Twitch IRC messages', () => {
    const message = parseMessage('twitchIRC', {
      message: '!Foo Bar Baz',
      ident: 'FooBar',
      time: 12345
    })

    expect(message).to.deep.equal({
      serviceID: 'twitchIRC',
      input: '!Foo Bar Baz',
      command: 'foo',
      args: ['Bar', 'Baz'],
      author: {
        username: 'FooBar'
      },
      timestamp: 12345
    })
  })

})