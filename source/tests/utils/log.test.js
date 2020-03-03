import assert from "assert"
import sinon  from "sinon"
import moment from "moment-timezone"

import log from "../../bot/utils/log"

describe("utils/log()", function() {

  const format = sinon.spy(() => "foo")

  before(function() {
    sinon.stub(console, "log")
    sinon.stub(moment, "utc").returns({format})
  })

  after(function() {
    sinon.restore()
  })

  it("should log messages", function() {
    log({label: "foobar", message: "bar baz"})
    log({message: "bar baz"})

    assert.equal(format.args[0][0], "YYYY-MM-DD HH:mm:ss z")
    assert.equal(console.log.args[0][0], "[foobar] foo: bar baz")
    assert.equal(console.log.args[1][0], "[SYSTEM] foo: bar baz")
  })

})