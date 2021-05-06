import * as assert from 'assert'
import * as sinon from 'sinon'

import errorEventHandler from '../../src/eventHandlers/error'

describe('eventHandlers/errorEventHandler()', function() {

  let log: any

  before(function() {
    log = sinon.stub(console, 'log')
  })

  after(function() {
    log.restore()
  })

  it('Should log errors', function() {
    const error = new Error('foo')

    errorEventHandler('')
    errorEventHandler('bar')
    errorEventHandler('', error)
    errorEventHandler('bar', error)

    assert.deepEqual(log.args, [
      ['UNKNOWN: foo'],
      ['BAR: foo'],
    ])
  })

})