import * as assert from 'assert'
import * as sinon from 'sinon'
import * as fetch from 'node-fetch'

import createFakeMessage from '../test-utils/createFakeMessage'

import xkcdCommand from '../../src/commands/xkcd'

describe('commands/xkcd', function() {

  let fetchStub: any

  before(function() {
    fetchStub = 
      sinon
        .stub(fetch, 'default')
        .callsFake(async (url): Promise<any> => ({
          json: async (): Promise<any> => ({
            img: 'https://foo.bar'
          })
        }))
  })

  after(function() {
    sinon.restore()
  })

  afterEach(function() {
    fetchStub.resetHistory()
  })

  it('should have the appropriate properties', function() {
    assert.equal(xkcdCommand.id, 'xkcd')

    assert.deepEqual(xkcdCommand.allowedServices, ['discord', 'twitchIRC'])
    assert.deepEqual(xkcdCommand.args, [[], ['id']])
    
    assert.ok(!xkcdCommand.isRestricted)
  })

  it('should output the latest XKCD comic', async function() {
    const actualMessage = createFakeMessage({
      command: {id: 'xkcd', args: []}
    })
    
    const expectedMessage = createFakeMessage({
      command: {id: 'xkcd', args: []},
      isFile: true,
      output: 'https://foo.bar'
    })

    await xkcdCommand.run(actualMessage)
  
    assert.deepEqual(fetchStub.args, [['https://xkcd.com/info.0.json']])
    assert.deepEqual(actualMessage, expectedMessage)
  })
  
  it('should output a specified XKCD comic', async function() {
    const actualMessage = createFakeMessage({
      command: {id: 'xkcd', args: ['12', '34']}
    })
    
    const expectedMessage = createFakeMessage({
      command: {id: 'xkcd', args: ['12', '34']},
      isFile: true,
      output: 'https://foo.bar'
    })

    await xkcdCommand.run(actualMessage)
  
    assert.deepEqual(fetchStub.args, [['https://xkcd.com/12/info.0.json']])
    assert.deepEqual(actualMessage, expectedMessage)
  })

  it('should output a fallback XKCD comic if the request was unsuccessful', async function() {
    fetchStub.restore()

    fetchStub =
      sinon
        .stub(fetch, 'default')
        .callsFake(async () => {
          throw new Error('qux')
        })

    const actualMessage = createFakeMessage({
      command: {id: 'xkcd', args: []}
    })
    
    const expectedMessage = createFakeMessage({
      command: {id: 'xkcd', args: []},
      isFile: true,
      output: 'https://imgs.xkcd.com/comics/not_available.png'
    })

    await xkcdCommand.run(actualMessage)
  
    assert.deepEqual(fetchStub.args, [['https://xkcd.com/info.0.json']])
    assert.deepEqual(actualMessage, expectedMessage)
  })

})