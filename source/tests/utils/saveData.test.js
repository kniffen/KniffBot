import assert from "assert"
import sinon  from "sinon"
import path   from "path"
import fs     from "fs"

import * as log     from "../../bot/utils/log"
import saveData from "../../bot/utils/saveData"

describe("utils/saveData()", function() {

  const bot = {
    data: {
      foo: "bar",
      bar: {
        baz: "qux"
      },
      baz: [
        {
          quux: `quuz`
        }
      ]
    }
  }

  before(function() {
    sinon.stub(path, "resolve").returns("foo.bar")
    sinon.stub(fs, "writeFileSync").callsFake(() => undefined)
    sinon.stub(log, "default")
  })

  after(function() {
    sinon.restore()
  })

  it("should save the data to a JSON file", function() {
    saveData(bot.data)

    assert(log.default.calledOnce)
    
    assert.deepEqual(log.default.args[0][0], {
      message: "Saving data"
    })
    
    assert.deepEqual(path.resolve.args[0], [
      __dirname.replace("tests", "bot"),
      "../../../data.json"
    ])

    assert.deepEqual(fs.writeFileSync.args[0], [
      "foo.bar",
      JSON.stringify(bot.data, null, 3)
    ])

  })

})