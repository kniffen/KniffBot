import assert from "assert"
import sinon  from "sinon"

import errorEventHandler from "../../bot/eventHandlers/error"
import * as log from "../../bot/utils/log"

describe("eventHandlers/errorEventHandler()", function() {

  before(function() {
    sinon.stub(console, "log").callsFake(() => { /* be quiet */ })
    sinon.stub(log, "default")
  })

  after(function() {
    sinon.restore()
  })

  it("should log errors", function() {
    const err = new Error("foobar")

    errorEventHandler("foo")
    errorEventHandler("foo", undefined)
    errorEventHandler("foo", null)
    errorEventHandler("foo", {})
    errorEventHandler("foo", err)

    assert.deepEqual(console.log.args[0][0], err)

    assert.deepEqual(log.default.args[0][0], {
      label:   "foo",
      message: "foobar",
    })
  })

})