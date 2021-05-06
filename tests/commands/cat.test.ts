import * as assert from 'assert'
import * as sinon from 'sinon'
import * as fetch from "node-fetch"

import createFakeMessage from '../test-utils/createFakeMessage'

import { Command } from '../../src/types'
import catCommand from '../../src/commands/cat'

describe('commands/cat', function() {

  it('should have the appropriate properties', function() {
    const expected: Command = {
      id: 'cat',
      allowedServices: ['discord'],
      category: 'fun',
      args: [[]],
      isRestricted: false,
      run: catCommand.run
    }

    assert.deepEqual(catCommand, expected)
  })

  it('should output a cat image', async function() {
    const fetchStub =
      sinon
        .stub(fetch, 'default')
        .callsFake(async (url): Promise<any> => ({
          json: async () => ({file: 'https://foo.bar'})
        }))

    const actualMessage = createFakeMessage()
    const expectedMessage = createFakeMessage()
    
    expectedMessage.output = 'https://foo.bar'
    expectedMessage.isFile = true

    await catCommand.run(actualMessage)

    assert.deepEqual(fetchStub.args, [['http://aws.random.cat/meow']])
    assert.deepEqual(actualMessage, expectedMessage)
 
    fetchStub.restore()
  })

  it('should output a fallback cat image if there are any issues', async function() {
    const fetchStub =
      sinon
        .stub(fetch, 'default')
        .callsFake(async url => {
          throw new Error('Error message')
        })

    const actualMessage = createFakeMessage()
    const expectedMessage = createFakeMessage()
    
    expectedMessage.output = 'http://i.imgur.com/Bai6JTL.jpg'
    expectedMessage.isFile = true

    await catCommand.run(actualMessage)

    assert.deepEqual(fetchStub.args, [['http://aws.random.cat/meow']])
    assert.deepEqual(actualMessage, expectedMessage)
 
    fetchStub.restore()
  })

})