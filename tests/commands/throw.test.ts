import * as assert from 'assert'
import * as sinon from 'sinon'

import createFakeMessage from '../test-utils/createFakeMessage'

import { Command } from '../../src/types'
import throwCommand from '../../src/commands/throw'

describe('commands/throw', function() {

  it('should have the appropriate properties', function() {
    const expected: Command = {
      id: 'throw',
      allowedServices: ['discord', 'twitchIRC'],
      category: 'fun',
      args: [['item']],
      isRestricted: false,
      run: throwCommand.run
    }

    assert.deepEqual(throwCommand, expected)
  })

  it('should throw the arguments', async function() {
    const actualMessage = createFakeMessage({
      command: {id: 'throw', args: ['foo', 'bar', 'baz']}
    })
    
    const expectedMessage = createFakeMessage({
      command: {id: 'throw', args: ['foo', 'bar', 'baz']},
      output: '(╯°□°）╯︵ foo bar baz'
    })

    await throwCommand.run(actualMessage)

    assert.deepEqual(actualMessage, expectedMessage)
  })

})