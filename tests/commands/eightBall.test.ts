import * as assert from 'assert'
import * as sinon from 'sinon'

import createFakeMessage from '../test-utils/createFakeMessage'

import { Command, Message } from '../../src/types'
import eightBallCommand from '../../src/commands/eightBall'

describe('commands/eightBall', function() {

  before(function() {
    sinon.stub(Math, 'random').callsFake(() => 0)
  })

  after(function() {
    sinon.restore()
  })

  it('should have the appropriate properties', function() {
    const expected: Command = {
      id: '8ball',
      allowedServices: ['discord', 'twitchIRC'],
      category: 'fun',
      args: [['question']],
      isRestricted: false,
      run: eightBallCommand.run
    }

    assert.deepEqual(eightBallCommand, expected)
  })

  it('should output a random answer', async function() {
    const actualMessage = createFakeMessage()
    const expectedMessage = createFakeMessage({
      output: 'It is certain',
      isReply: true
    })

    await eightBallCommand.run(actualMessage)

    assert.deepEqual(actualMessage, expectedMessage)
  })

})