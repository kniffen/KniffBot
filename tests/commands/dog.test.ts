import * as assert from 'assert'
import * as sinon from 'sinon'
import * as fetch from "node-fetch"

import createFakeMessage from '../test-utils/createFakeMessage'

import { Command } from '../../src/types'
import dogCommand from '../../src/commands/dog'

describe('commands/dog', function() {

  it('should have the appropriate properties', function() {
    const expected: Command = {
      id: 'dog',
      allowedServices: ['discord'],
      category: 'fun',
      args: [[]],
      isRestricted: false,
      run: dogCommand.run
    }

    assert.deepEqual(dogCommand, expected)
  })

  it('should output a dog image', async function() {
    const fetchStub =
      sinon
        .stub(fetch, 'default')
        .callsFake(async (url): Promise<any> => ({
          json: async(): Promise<any> => ({message: 'https://foo.bar'})
        }))

    const actualMessage = createFakeMessage()
    const expectedMessage = createFakeMessage()
    
    expectedMessage.output = 'https://foo.bar'
    expectedMessage.isFile = true

    await dogCommand.run(actualMessage)

    assert.deepEqual(fetchStub.args, [['https://dog.ceo/api/breeds/image/random']])
    assert.deepEqual(actualMessage, expectedMessage)
 
    fetchStub.restore()
  })

  it('should output a fallback dog image if there are any issues', async function() {
    const fetchStub =
      sinon
        .stub(fetch, 'default')
        .callsFake(async (url) => {
          throw new Error('Error message')
        })

    const actualMessage = createFakeMessage()
    const expectedMessage = createFakeMessage()
    
    expectedMessage.output = 'https://i.imgur.com/9oPUiCu.gif'
    expectedMessage.isFile = true
    
    await dogCommand.run(actualMessage)

    assert.deepEqual(fetchStub.args, [['https://dog.ceo/api/breeds/image/random']])
    assert.deepEqual(actualMessage, expectedMessage)
 
    fetchStub.restore()
  })

})