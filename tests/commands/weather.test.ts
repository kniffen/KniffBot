import * as assert from 'assert'
import * as sinon from 'sinon'

import DiscordJS from 'discord.js'
const weatherJS = require('weather-js')

import createFakeMessage from '../test-utils/createFakeMessage'

import settings from '../../src/settings'
import weatherCommand from '../../src/commands/weather'

describe('commands/weather', function() {

  let weatherJSFindStub: any

  const weatherData = [
    {
      location: {
        name: 'FooBar'
      },
      current: {
        day:             'foo',
        observationtime: 'bar',
        skytext:         'baz',
        imageUrl:        'foo.bar',
        windspeed:       '0 km/h',
        winddisplay:     '64 km/h southeast',
        temperature:     16,
        feelslike:       0,
      },
      forecast: [
        {},
        {
          day:        'qux',
          skytextday: 'quux',
          low:        -20,
          high:       30,
          precip:     '50'
        }
      ]
    }
  ]

  before(function() {
    weatherJSFindStub =
      sinon
        .stub(weatherJS, 'find')
        .callsFake((input, cb) => {
          cb(undefined, weatherData)
        })
  })

  it('should have the appropriate properties', function() {
    assert.equal(weatherCommand.id, 'weather')

    assert.deepEqual(weatherCommand.allowedServices, ['discord'])
    assert.deepEqual(weatherCommand.args, [['location']])
    
    assert.ok(!weatherCommand.isRestricted)
  })

  it('should throw a specific error message if there are missing arguments', async function() {
    const actualMessage = createFakeMessage({command: {id: 'weather', args: []}})

    try {
      await weatherCommand.run(actualMessage)
    } catch ( err ) {
      assert.equal(err.message, `Missing arguments\nFor help type \`${settings.commandPrefix}help weather\``)
    }
  })

  it('should output a weather report for a specified location', async function() {
    const actualMessage = createFakeMessage({command: {id: 'weather', args: ['foo', 'bar', 'baz']}})
    const expectedMessage = createFakeMessage({command: {id: 'weather', args: ['foo', 'bar', 'baz']}})

    expectedMessage.output = new DiscordJS.MessageEmbed()

    expectedMessage.output.setAuthor('Weather report for FooBar', 'foo.bar')
    expectedMessage.output.setColor(settings.discordEmbedColor)

    expectedMessage.output.addField('foo bar', 'baz', false)
    expectedMessage.output.addField('Temp', '16°C/60°F', true)
    expectedMessage.output.addField('Feels like', '0°C/32°F', true)
    expectedMessage.output.addField('Wind', '18m/s or 40mph southeast', true)
    expectedMessage.output.addField('qux forecast', 'quux', false)
    expectedMessage.output.addField('Temp low', '-20°C/-4°F', true)
    expectedMessage.output.addField('Temp high', '30°C/86°F', true)
    expectedMessage.output.addField('Precip probability', '50%', true)

    expectedMessage.output.setFooter('Weather report provided by Microsoft')

    await weatherCommand.run(actualMessage)

    assert.deepEqual(actualMessage, expectedMessage)
  })

  it('should throw a specific error message if it was unable to fetch the weather data', async function() {
    weatherJSFindStub.restore()

    weatherJSFindStub =
      sinon
        .stub(weatherJS, 'find')
        .callsFake((input, cb) => {
          throw new Error('Error message that should be ignored')
        })
    
    const actualMessage = createFakeMessage({command: {id: 'weather', args: ['foo', 'bar', 'baz']}})

    try {
      await weatherCommand.run(actualMessage)
    } catch ( err ) {
      assert.equal(err.message, 'Unable to fetch a weather report for **foo bar baz**')
    }

  })

  it('should re-attempt to fetch the weather data twice before outputting an error message')

})