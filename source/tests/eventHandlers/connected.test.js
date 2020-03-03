import assert from "assert"
import sinon  from "sinon"

import connected from "../../bot/eventHandlers/connected"
import * as log  from "../../bot/utils/log"

describe("eventHandlers/connected()", function() {

  before(function() {
    sinon.stub(log, "default")
  })

  after(function() {
    sinon.restore()
  })

  it("should log connections", function() {
    connected("foobar")

    assert.deepEqual(log.default.args[0][0],{
      label:   "foobar",
      message: "connected"
    })
  })

})