import * as assert from 'assert'
import * as sinon from 'sinon'

import createFakeMessage from '../test-utils/createFakeMessage'

import { Command } from '../../src/types'
import pingCommand from '../../src/commands/ping'

describe('commands/ping', function() {

  it('should have the appropriate properties', function() {
    const expected: Command = {
      id: 'ping',
      allowedServices: ['discord', 'twitchIRC'],
      category: 'utility',
      args: [[]],
      isRestricted: false,
      run: pingCommand.run
    }

    assert.deepEqual(pingCommand, expected)
  })

  it('should output "Pong!"', async function() {
    const actualMessage = createFakeMessage()
    const expectedMessage = createFakeMessage({output: 'Pong!'})

    await pingCommand.run(actualMessage)

    assert.deepEqual(actualMessage, expectedMessage)
  })

})