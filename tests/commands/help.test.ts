import * as assert from 'assert'
import * as sinon from 'sinon'
import DiscordJS from 'discord.js'

import createFakeMessage from '../test-utils/createFakeMessage'

import settings from '../../src/settings'
import { Command, Message } from '../../src/types'
import helpCommand from '../../src/commands/help'

describe('commands/help', function() {

  it('should have the appropriate properties', function() {
    const expected: Command = {
      id: 'help',
      allowedServices: ['discord', 'twitchIRC'],
      category: 'utility',
      args: [[], ['command']],
      isRestricted: false,
      run: helpCommand.run
    }

    assert.deepEqual(helpCommand, expected)
  })

  it('should output the available arguments for a command', async function() {
    const actualMessage = createFakeMessage({
      service: 'discord',
      command: {id: 'help', args: ['weather']}
    })
    
    const expectedMessage = createFakeMessage({
      service: 'discord', 
      command: {id: 'help', args: ['weather']},
      output: 'Usages for `!?weather`\n`!?weather <location>`'
    })

    await helpCommand.run(actualMessage)

    assert.deepEqual(actualMessage, expectedMessage)
  })

  describe('discord', function() {

    let expectedMessage: Message

    before(function() {
      expectedMessage = createFakeMessage({
        service: 'discord',
        command: {id: 'help', args: []}
      })

      expectedMessage.output = new DiscordJS.MessageEmbed()

      expectedMessage.output.setAuthor('🤖 Available bot commands')
      expectedMessage.output.setColor(settings.discordEmbedColor)

      expectedMessage.output.addField('fun', '!?cat\n!?dog\n!?8ball\n!?throw\n!?xkcd', true)
      expectedMessage.output.addField('utility', '!?help\n!?ping', true)
      expectedMessage.output.addField('info', '!?time\n!?weather\n!?wolfram', true)
    })

    it('should output a list of commands and useful information', async function() {
      const actualMessage = createFakeMessage({
        service: 'discord',
        command: {id: 'help', args: []}
      })
      
      await helpCommand.run(actualMessage)

      assert.deepEqual(actualMessage, expectedMessage)
    })
    
    it('should output a list of commands and useful information if a specified command does not exist', async function() {
      const actualMessage = createFakeMessage({
        service: 'discord',
        command: {id: 'help', args: ['foo']}
      })
      
      expectedMessage.command.args[0] = 'foo'
      
      await helpCommand.run(actualMessage)

      assert.deepEqual(actualMessage, expectedMessage)
    })

  })

  describe('twitchIRC', function() {

    let expectedMessage: Message

    before(function() {
      expectedMessage = createFakeMessage({
        service: 'twitchIRC',
        command: {id: 'help', args: []},
        output: "!?8ball !?help !?ping !?throw !?time !?xkcd"
      })
    })

    it('should output a list of commands and useful information', async function() {
      const actualMessage = createFakeMessage({
        service: 'twitchIRC', 
        command: {id: 'help', args: []}
      })
      
      await helpCommand.run(actualMessage)

      assert.deepEqual(actualMessage, expectedMessage)
    })

    it('should output a list of commands and useful information if a specified command does not exist', async function() {
      const actualMessage = createFakeMessage({
        service: 'twitchIRC',
        command: {id: 'help', args: ['foo']}
      })
      
      expectedMessage.command.args[0] = 'foo'
      
      await helpCommand.run(actualMessage)

      assert.deepEqual(actualMessage, expectedMessage)
    })

  })

})