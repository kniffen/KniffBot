import assert from "assert"

import deepCopy from "../../bot/utils/deepCopy"

describe("utils/deepCopy()", function() {

  const input = {
    foo: 100,
    bar: "foofoo",
    baz: [
      200,
      "foobar",
      [
        300,
        "foobaz",
        {
          qux: 400,
          quux: "fooqux",
          quuz: [
            500,
            "fooquux"
          ]
        }
      ],
      {
        foo: 600,
        bar: "fooquuz",
        baz: {
          foo: 700,
          bar: "foocorge",
          baz: {
            foo: 800,
            bar: "barfoo",
            baz: [1,2,3,4, "foo"]
          }
        }
      }
    ],
    qux: {
      foo: 900,
      bar: "barqux",
      baz: [5,6,7,8,9],
      qux: {
        foo: 1000,
        bar: "barquux"
      }
    }
  }

  it("should deep copy an object", function() {
    const a = deepCopy(input)

    a.foo                   = 1234
    a.baz[1]                = "barbar"
    a.baz[2][0]             = 5678
    a.baz[2][2].quux        = "barbaz"
    a.baz[3].baz.baz.foo    = 1111
    a.baz[3].baz.baz.baz[0] = 2222
    a.qux.foo               = 3333
    a.qux.baz[2]            = 4444
    a.qux.qux.foo           = 5555
    a.quux                  = [11,22,33,44]

    const b = deepCopy(input, {
      foo: 1234,
      baz: [
        undefined,
        "barbar",
        [
          5678,
          undefined,
          {
            quux: "barbaz"
          }
        ],
        {
          baz: {
            baz: {
              foo: 1111,
              baz: [
                2222
              ]
            }
          }
        }
      ],
      qux: {
        foo: 3333,
        baz: [
          undefined,
          undefined,
          4444
        ],
        qux: {
          foo: 5555
        }
      },
      quux: [11,22,33,44]
    })

    assert.deepEqual(input, {
      foo: 100,
      bar: "foofoo",
      baz: [
        200,
        "foobar",
        [
          300,
          "foobaz",
          {
            qux: 400,
            quux: "fooqux",
            quuz: [
              500,
              "fooquux"
            ]
          }
        ],
        {
          foo: 600,
          bar: "fooquuz",
          baz: {
            foo: 700,
            bar: "foocorge",
            baz: {
              foo: 800,
              bar: "barfoo",
              baz: [1,2,3,4, "foo"]
            }
          }
        }
      ],
      qux: {
        foo: 900,
        bar: "barqux",
        baz: [5,6,7,8,9],
        qux: {
          foo: 1000,
          bar: "barquux"
        }
      }
    })

    assert.deepEqual(a, {
      foo: 1234,
      bar: "foofoo",
      baz: [
        200,
        "barbar",
        [
          5678,
          "foobaz",
          {
            qux: 400,
            quux: "barbaz",
            quuz: [
              500,
              "fooquux"
            ]
          }
        ],
        {
          foo: 600,
          bar: "fooquuz",
          baz: {
            foo: 700,
            bar: "foocorge",
            baz: {
              foo: 1111,
              bar: "barfoo",
              baz: [2222,2,3,4, "foo"]
            }
          }
        }
      ],
      qux: {
        foo: 3333,
        bar: "barqux",
        baz: [5,6,4444,8,9],
        qux: {
          foo: 5555,
          bar: "barquux"
        }
      },
      quux: [11,22,33,44]
    })

    assert.deepEqual(b, {
      foo: 1234,
      bar: "foofoo",
      baz: [
        200,
        "barbar",
        [
          5678,
          "foobaz",
          {
            qux: 400,
            quux: "barbaz",
            quuz: [
              500,
              "fooquux"
            ]
          }
        ],
        {
          foo: 600,
          bar: "fooquuz",
          baz: {
            foo: 700,
            bar: "foocorge",
            baz: {
              foo: 1111,
              bar: "barfoo",
              baz: [2222,2,3,4, "foo"]
            }
          }
        }
      ],
      qux: {
        foo: 3333,
        bar: "barqux",
        baz: [5,6,4444,8,9],
        qux: {
          foo: 5555,
          bar: "barquux"
        }
      },
      quux: [11,22,33,44]
    })
  })

})