import * as assert from 'assert'
import * as sinon from 'sinon'
import DiscordJS from 'discord.js'

import createFakeMessage from '../test-utils/createFakeMessage'

import settings from '../../src/settings'
import wolframAlpha from '../../src/services/wolframAlpha'
import wolframCommand from '../../src/commands/wolfram'

describe('commands/wolfram', function() {

  let wolframAlphaQueryStub: any

  const wolframAlphaQueryResult: any = {
    data: {
      queryresult: {
        sources: {
          url: "https://foo.bar"
        },
        pods: [
          {
            title: "foo",
            subpods: [
              {
                plaintext: "bar"
              }
            ]
          },
          {
            title: "baz",
            subpods: [
              {plaintext: "qux"},
            ]
          },
          {
            title: "baz",
            subpods: [
              {img: {src: "https://bar.foo"}}
            ]
          }
        ]
      }
    }
  }

  before(function() {
    wolframAlphaQueryStub =
      sinon
        .stub(wolframAlpha, 'query')
        .callsFake(async (input) => wolframAlphaQueryResult)
  })

  it('should have the appropriate properties', function() {
    assert.equal(wolframCommand.id, 'wolfram')

    assert.deepEqual(wolframCommand.allowedServices, ['discord'])
    assert.deepEqual(wolframCommand.args, [['query']])
    
    assert.ok(!wolframCommand.isRestricted)
  })
  
  it('should output a rich embed with query results', async function() {
    const actualMessage = createFakeMessage({command: {id: 'wolfram', args: ['foo', 'bar', 'baz']}})
    const expectedMessage = createFakeMessage({command: {id: 'wolfram', args: ['foo', 'bar', 'baz']}})

    expectedMessage.output = new DiscordJS.MessageEmbed()

    expectedMessage.output.setTitle('bar')
    expectedMessage.output.setColor(settings.discordEmbedColor)
    expectedMessage.output.setURL('https://foo.bar')
    expectedMessage.output.addField('baz', 'qux')
    expectedMessage.output.setImage('https://bar.foo')

    await wolframCommand.run(actualMessage)
    
    assert.deepEqual(actualMessage, expectedMessage)
  })
  
  it('should throw a specific error message if the query did not resolve', async function() {
    wolframAlphaQueryStub.restore()

    wolframAlphaQueryStub =
      sinon
        .stub(wolframAlpha, 'query')
        .callsFake(async (input: string) => {
          throw new Error('Error message that should be ignored')
        })

    const actualMessage = createFakeMessage({command: {id: 'wolfram', args: ['foo', 'bar', 'baz']}})
    const expectedMessage = createFakeMessage({command: {id: 'wolfram', args: ['foo', 'bar', 'baz']}})

    try {
      await wolframCommand.run(actualMessage)
    } catch (err) {
      assert.equal(err.message, 'Could not find any Wolfram|Alpha data for **foo bar baz**')
    }

    assert.deepEqual(actualMessage, expectedMessage)
  })

})