import assert from "assert"
import sinon  from "sinon"
import path   from "path"
import fs     from "fs"

import * as log     from "../../bot/utils/log"
import saveProfiles from "../../bot/utils/saveProfiles"

describe("utils/saveProfiles()", function() {

  const bot = {
    profiles: {foo: "bar"}
  }

  before(function() {
    sinon.stub(path, "resolve").returns("foo.bar")
    sinon.stub(fs, "writeFileSync").callsFake(() => undefined)
    sinon.stub(log, "default")
  })

  after(function() {
    sinon.restore()
  })

  it("should the profile data to as JSON files", function() {
    saveProfiles(bot)

    assert(log.default.calledOnce)
    assert.deepEqual(log.default.args[0][0], {
      message: "Saving profiles"
    })
    assert.deepEqual(path.resolve.args[0], [
      __dirname.replace("tests", "bot"),
      "../../../profiles.json"
    ])
    assert.deepEqual(fs.writeFileSync.args[0], [
      "foo.bar",
      JSON.stringify(bot.profiles, null, 3)
    ])

  })

})