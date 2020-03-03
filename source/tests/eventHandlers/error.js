import assert from "assert"
import sinon  from "sinon"

import error    from "../../bot/eventHandlers/error"
import * as log from "../../bot/utils.log"

describe("eventHandlers/error()", function() {

  before(function() {
    sinon.stub(log, "default")
  })

  after(function() {
    sinon.restore()
  })

  it("should log errors", function() {
    error("foo", "bar")

    assert.deepEqual(log.default.args[0][0], {
      label:   "foo",
      message: "bar",
      isError: true
    })
  })

})