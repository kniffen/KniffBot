import * as assert from 'assert'
import * as sinon from 'sinon'
import DiscordJS from 'discord.js'

import createFakeMessage from '../test-utils/createFakeMessage'

import * as discord from '../../src/services/discord'
import createParsedMessage from '../../src/utils/createParsedMessage'

describe('utils/createParsedMessage()', function() {

  before(function() {
    sinon.stub(Date, 'now').callsFake(() => 1234)
  })

  after(function() {
    sinon.restore()
  })

  it('should return a parsed message object no matter what', function() {
    const actualMessage = createParsedMessage('foobar', {})
    
    const expectedMessage = createFakeMessage({
      service: 'foobar',
      timestamp: 1234,
    })

    expectedMessage.input = ''
    expectedMessage.author = {
      id: '',
      name: '',
      isAuthorized: false
    }

    assert.deepEqual(actualMessage, expectedMessage)
  })

  describe('Discord', function() {
    let discordMessageData: DiscordJS.Message

    const discordClient = new DiscordJS.Client()
    const discordGuild = new DiscordJS.Guild(discordClient, {})
    const discordChannel = new DiscordJS.TextChannel(discordGuild, {})

    discordClient.user = new DiscordJS.ClientUser(discordClient, {id: 12345678912345678, username: 'FooBar'})

    beforeEach(function() {
      sinon.stub(discord, 'default').value(discordClient)

      discordMessageData = new DiscordJS.Message(
        discordClient,
        {
          id: '123456789123456789',
          content: 'foo bar',
          author: {id: 'discordAuthor', username: 'DiscordAuthorName'}
        },
        discordChannel
      )
    })

    it('should parse messages', function() {
      const actualMessage = createParsedMessage('discord', discordMessageData)
      
      const expectedMessage = createFakeMessage({
        service: 'discord',
        timestamp: discordMessageData.createdTimestamp,
        input: 'foo bar',
        author: {id: 'discordAuthor', name: 'DiscordAuthorName', isAuthorized: false},
        original: discordMessageData,
      })
   
      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should parse commands', function() {
      discordMessageData = new DiscordJS.Message(
        discordClient,
        {
          id: '987654321987654321',
          content: `!?ping foo bar`,
          author: {id: 'discordAuthor', username: 'DiscordAuthorName'}
        },
        discordChannel
      )

      const actualMessage = createParsedMessage('discord', discordMessageData)
      
      const expectedMessage = createFakeMessage({
        service: 'discord',
        timestamp: discordMessageData.createdTimestamp,
        input: `!?ping foo bar`,
        command: {id: 'ping', args: ['foo', 'bar']},
        author: {id: 'discordAuthor', name: 'DiscordAuthorName', isAuthorized: false},
        original: discordMessageData,
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should not parse commands that so not exist', function() {
      discordMessageData.content = `!?foo bar baz`

      const actualMessage = createParsedMessage('discord', discordMessageData)

      const expectedMessage = createFakeMessage({
        service: 'discord',
        timestamp: discordMessageData.createdTimestamp,
        input: `!?foo bar baz`,
        author: {id: 'discordAuthor', name: 'DiscordAuthorName', isAuthorized: false},
        original: discordMessageData,
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should detect bot mentions', function() {
      discordMessageData.mentions.users.set(discordClient.user.id, discordClient.user)

      const actualMessage = createParsedMessage('discord', discordMessageData)

      const expectedMessage = createFakeMessage({
        service: 'discord',
        timestamp: discordMessageData.createdTimestamp,
        input: 'foo bar',
        author: {id: 'discordAuthor', name: 'DiscordAuthorName', isAuthorized: false},
        isMentioned: true,
        original: discordMessageData,
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should detect if the message is from a bot', function() {
      discordMessageData.author.id = '12345678912345678'
      discordMessageData.author.username = 'FooBar'

      const actualMessage = createParsedMessage('discord', discordMessageData)

      const expectedMessage = createFakeMessage({
        service: 'discord',
        timestamp: discordMessageData.createdTimestamp,
        input: 'foo bar',
        author: {id: '12345678912345678', name: 'FooBar', isAuthorized: false},
        isBot: true,
        original: discordMessageData,
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should detect if the message author is authorized')

    it('should handle missing member reference')

  })

  describe('Twitch IRC', function() {

    let twitchIRCMessage: any

    beforeEach(function() {
      twitchIRCMessage = {
        message: 'foo bar baz',
        ident: 'baz',
        nick: 'Baz'
      }
    })

    it('should parse messages', function() {
      const actualMessage = createParsedMessage('twitchIRC', twitchIRCMessage)

      const expectedMessage = createFakeMessage({
        service: 'twitchIRC',
        input: 'foo bar baz',
        timestamp: 1234,
        author: {id: 'baz', name: 'Baz', isAuthorized: false},
        original: twitchIRCMessage
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should parse commands', function() {
      twitchIRCMessage.message = '!?weather foo bar'

      const actualMessage = createParsedMessage('twitchIRC', twitchIRCMessage)

      const expectedMessage = createFakeMessage({
        service: 'twitchIRC',
        input: '!?weather foo bar',
        timestamp: 1234,
        author: {id: 'baz', name: 'Baz', isAuthorized: false},
        command: {id: 'weather', args: ['foo', 'bar']},
        original: twitchIRCMessage
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should not parse commands that so not exist', function() {
      twitchIRCMessage.message = '!?foo bar baz'

      const actualMessage = createParsedMessage('twitchIRC', twitchIRCMessage)

      const expectedMessage = createFakeMessage({
        service: 'twitchIRC',
        input: '!?foo bar baz',
        timestamp: 1234,
        author: {id: 'baz', name: 'Baz', isAuthorized: false},
        original: twitchIRCMessage
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should parse bot mentions', function() {
      twitchIRCMessage.message = '@twitch_irc_username bar baz'

      const actualMessage = createParsedMessage('twitchIRC', twitchIRCMessage)

      const expectedMessage = createFakeMessage({
        service: 'twitchIRC',
        input: '@twitch_irc_username bar baz',
        timestamp: 1234,
        author: {id: 'baz', name: 'Baz', isAuthorized: false},
        isMentioned: true,
        original: twitchIRCMessage
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should detect if the message is from a bot', function() {
      twitchIRCMessage.ident = 'twitch_irc_username'
      twitchIRCMessage.nick = 'Twitch_IRC_Username'

      const actualMessage = createParsedMessage('twitchIRC', twitchIRCMessage)

      const expectedMessage = createFakeMessage({
        service: 'twitchIRC',
        input: 'foo bar baz',
        timestamp: 1234,
        author: {id: 'twitch_irc_username', name: 'Twitch_IRC_Username', isAuthorized: false},
        isBot: true,
        original: twitchIRCMessage
      })

      assert.deepEqual(actualMessage, expectedMessage)
    })

  })

})