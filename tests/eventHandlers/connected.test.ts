import * as assert from 'assert'
import * as sinon from 'sinon'

import connectedEventHandler from '../../src/eventHandlers/connected'

describe('eventHandlers/connectedEventHandler()', function() {

  let log: any

  before(function() {
    log = sinon.stub(console, 'log')
  })

  after(function() {
    log.restore()
  })

  it('Should log connection events', function() {
    connectedEventHandler()
    connectedEventHandler('')
    connectedEventHandler('foobar')

    assert.deepEqual(log.args, [
      ['UNKNOWN: connected'],
      ['UNKNOWN: connected'],
      ['FOOBAR: connected'],
    ])
  })

})