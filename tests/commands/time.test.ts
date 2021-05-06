import * as assert from 'assert'
import * as sinon from 'sinon'
import * as moment from 'moment-timezone'

import createFakeMessage from '../test-utils/createFakeMessage'

import { Command } from '../../src/types'
import timeCommand from '../../src/commands/time'

describe('commands/time', function() {

  let clock: any

  before(function() {
    clock = sinon.useFakeTimers()
  })

  after(function() {
    clock.restore()
    sinon.restore()
  })

  it('should have the appropriate properties', function() {
    const expectedCommand: Command = {
      id: 'time',
      allowedServices: ['discord', 'twitchIRC'],
      category: 'info',
      args: [[], ['location']],
      isRestricted: false,
      run: timeCommand.run
    }

    assert.deepEqual(timeCommand, expectedCommand)
  })

  it('should output the current UTC time', async function() {
    const actualMessage = createFakeMessage({
      command: {id: 'time', args: []}
    })
    
    const expectedMessage = createFakeMessage({
      command: {id: 'time', args: []},
      isReply: true,
      output: 'It\'s currently Thursday, January 1, 1970 12:00 AM UTC'
    })

    await timeCommand.run(actualMessage)

    assert.deepEqual(actualMessage, expectedMessage)
  })
  
  it('should output the time for a specified location', async function() {
    const actualMessage = createFakeMessage({
      command: {id: 'time', args: ['paris', 'Texas']}
    })
    
    const expectedMessage = createFakeMessage({
      command: {id: 'time', args: ['paris', 'Texas']},
      isReply: true,
      output: 'It\'s Wednesday, December 31, 1969 6:00 PM in America/Chicago'
    })

    await timeCommand.run(actualMessage)

    assert.deepEqual(actualMessage, expectedMessage)
  })

})