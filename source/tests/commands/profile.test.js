import assert from "assert"
import sinon  from "sinon"

import deepCopy        from "../../bot/utils/deepCopy"
import * as saveData   from "../../bot/utils/saveData"
import * as profileCmd from "../../bot/commands/profile"

describe("commands/profile()", function() {

  const bot = {
    data: {
      settings: {
        color: 0xFF0000
      }
    }
  }

  const messageTemplate = {
    service: "foobar",
    mentions: [],
    original: {
      channel: {
        guild: {
          name: "qux",
          members: [
            {
              id:              1234,
              joinedTimestamp: 10000000000,
              roles: [
                {name: "@everyone"},
                {name: "everyone"},
                {name: "someone"}
              ],
              user: {
                id:               1234,
                discriminator:    5,
                createdTimestamp: 11000000000,
                username:         "quux",
                avatarURL:        "foo.bar",
                presence: {
                  status: "online"
                }
              }
            },
            {
              id: 4321,
              joinedTimestamp: 12000000000,
              roles: [
                {name: "@everyone"}
              ],
              user: {
                id:               4321,
                discriminator:    6,
                createdTimestamp: 13000000000,
                username:         "quuz",
                avatarURL:        "bar.foo",
                presence: {
                  status: "offline"
                }
              }
            },
            {
              id: 5678,
              joinedTimestamp: 14000000000,
              roles: [],
              user: {
                id:               5678,
                discriminator:    7,
                createdTimestamp: 15000000000,
                username:         "corge",
                avatarURL:        "qux.quux",
                presence: {
                  status: "offline"
                }
              }
            },
            {
              id: 1111,
              joinedTimestamp: 16000000000,
              roles: [],
              user: {
                id:               1111,
                discriminator:    7,
                createdTimestamp: 17000000000,
                username:         "grault",
                avatarURL:        "grault.garply",
                presence: {
                  status: "offline"
                }
              }
            }
          ]
        }
      }
    }
  }

  const discordEmbed = {
    author: {
      icon_url: undefined,
      url:      undefined,
      name:     undefined,
    },
    color:       0xFF0000,
    description: undefined,
    file:        undefined,
    files:       [],
    footer:      undefined,
    image:       undefined,
    thumbnail:   undefined,
    timestamp:   undefined,
    title:       undefined,
    url:         undefined,
    fields:      []
  }

  before(function() {
    sinon.stub(saveData, "default")
  })

  after(function() {
    sinon.restore()
  })

  beforeEach(function() {
    bot.data.profiles = [
      {
        id: 1234,
        location: "baz",
        service: "barfoo"
      },
      {
        id: 1234,
        location: "foo",
        service: "foobar"
      },
      {
        id: 5678,
        location: "corge",
        service: "foobar"
      },
      {
        id: 4321,
        location: "bar",
        service: "foobar"
      }
    ]

    saveData.default.resetHistory()
  })

  it("Should have appropriate properties", function() {
    assert.deepEqual(profileCmd, {
      id:           "profile",
      category:     "utility",
      services:     ["discord"],
      args:         [
        [],
        ["location"],
        ["location", "<location>"],
        ["remove", "<item>"],
        ["@username"]
      ],
      isRestricted: false,
      default:      profileCmd.default
    })
  })

  it("should output a rich embed of the author's profile", async function() {
    const messages = [
      deepCopy(messageTemplate, {
        author: {
          id: 1234
        },
        isDM: false
      }),
      deepCopy(messageTemplate, {
        author: {
          id: 1234,
          discriminator: 5,
          username:      "quux",
          avatarURL:     "foo.bar"
        },
        isDM: true
      }),
      deepCopy(messageTemplate, {
        author: {
          id:            1111,
          discriminator: 7,
          username:      "corge",
          avatarURL:     "qux.quux"
        },
        isDM: true
      })
    ]
    const expected = [
      deepCopy(messages[0]),
      deepCopy(messages[1]),
      deepCopy(messages[2]),
    ]

    expected[0].output = deepCopy(discordEmbed, {
      author: {
        name:     "Profile for quux",
        icon_url: "foo.bar"
      },
      fields: [
        {name: "Discriminator",   value: "#5",                inline: true},
        {name: "Identifier",      value: "1234",              inline: true},
        {name: "Status",          value: "online",            inline: true},
        {name: "Account created", value: "May 8, 1970",       inline: true},
        {name: "Joined qux",      value: "April 26, 1970",    inline: true},
        {name: "Roles",           value: "everyone, someone", inline: true},
      ]
    })

    expected[1].output = deepCopy(discordEmbed, {
      author: {
        name:     "Profile for quux",
        icon_url: "foo.bar"
      },
      fields: [
        {name: "Discriminator",   value: "#5",                inline: true},
        {name: "Identifier",      value: "1234",              inline: true},
        {name: "Location",        value: "foo",               inline: true},
      ]
    })

    expected[2].output = deepCopy(discordEmbed, {
      author: {
        name:     "Profile for corge",
        icon_url: "qux.quux"
      },
      fields: [
        {name: "Discriminator",   value: "#7",            inline: true},
        {name: "Identifier",      value: "1111",          inline: true},
      ]
    })

    await profileCmd.default(messages[0], bot)
    await profileCmd.default(messages[1], bot)
    await profileCmd.default(messages[2], bot)

    assert.deepEqual(messages, expected)
  })

  it("should work in direct messages", async function() {
    const messages = [
      {
        service: "foobar",
        isDM: true,
        mentions: [],
        author: {
          id:            1234,
          discriminator: 5,
          username:      "quux",
          avatarURL:     "foo.bar"
        }
      },
      {
        service: "foobar",
        isDM: true,
        mentions: [{id: 4321}],
        author: {
          id:            1234,
          discriminator: 5,
          username:      "quux",
          avatarURL:     "foo.bar"
        }
      }
    ]

    const expected = [
      deepCopy(messages[0]),
      deepCopy(messages[1])
    ]

    expected[0].output = deepCopy(discordEmbed, {
      author: {
        name:     "Profile for quux",
        icon_url: "foo.bar"
      },
      fields: [
        {name: "Discriminator",   value: "#5",   inline: true},
        {name: "Identifier",      value: "1234", inline: true},
        {name: "Location",        value: "foo",  inline: true},
      ]
    })

    expected[1].output  = "Unable to find user profile"
    expected[1].isReply = true

    await profileCmd.default(messages[0], bot)
    await profileCmd.default(messages[1], bot)

    assert.deepEqual(messages, expected)
  })

  it("should output a rich embed of a target user's profile", async function() {
    const message = deepCopy(messageTemplate, {
      author:   {id: 1234},
      mentions: [{id: 4321}]
    })
    
    const expected = deepCopy(message)

    expected.output = deepCopy(discordEmbed, {
      author: {
        name:     "Profile for quuz",
        icon_url: "bar.foo"
      },
      fields: [
        {name: "Discriminator",   value: "#6",           inline: true},
        {name: "Identifier",      value: "4321",         inline: true},
        {name: "Status",          value: "offline",      inline: true},
        {name: "Account created", value: "May 31, 1970", inline: true},
        {name: "Joined qux",      value: "May 19, 1970", inline: true},
      ]
    })

    await profileCmd.default(message, bot)

    assert.deepEqual(message, expected)
  })

  it("should return a specific error message if the user could not be found", async function() {
    const messages = [
      deepCopy(messageTemplate, {author:   {id: 9999}}),
      deepCopy(messageTemplate, {author:   {id: 1234}, mentions: [{id: 9999}]}),
    ]

    const expected = [
      deepCopy(messages[0], {output: "Unable to find user profile", isReply: true}),
      deepCopy(messages[1], {output: "Unable to find user profile", isReply: true})
    ]

    await profileCmd.default(messages[0], bot)
    await profileCmd.default(messages[1], bot)

    assert.deepEqual(messages, expected)
  })

  it("should set the location of a user", async function() {
    const messages = [
      deepCopy(messageTemplate, {
        service: "foobar",
        author:  {id: 1234},
        command: {args: ["location"]}
      }),
      deepCopy(messageTemplate, {
        service: "foobar",
        author:  {id: 1234},
        command: {args: ["location", "corge"]}
      }),
      deepCopy(messageTemplate, {
        service: "foobar",
        author:  {id: 5678},
        command: {args: ["location", "corge", "grault"]}
      }),
      deepCopy(messageTemplate, {
        service: "foobar",
        author:  {id: 1111},
        command: {args: ["location", "grault"]}
      })
    ]

    const expected = [
      deepCopy(messages[0], {output:  "Your current location is foo",              isReply: true}),
      deepCopy(messages[1], {output:  "Your location is now set to corge",         isReply: true}),
      deepCopy(messages[2], {output:  "Your location is now set to corge grault",  isReply: true}),
      deepCopy(messages[3], {output:  "Your location is now set to grault",        isReply: true})
    ]

    await profileCmd.default(messages[0], bot)
    await profileCmd.default(messages[1], bot)
    await profileCmd.default(messages[2], bot)
    await profileCmd.default(messages[3], bot)

    assert.deepEqual(messages, expected)

    assert.deepEqual(saveData.default.args[0][0], bot.data)
    assert.deepEqual(saveData.default.args[1][0], bot.data)
    assert.deepEqual(saveData.default.args[2][0], bot.data)
    assert.deepEqual(saveData.default.args[3][0], bot.data)

    assert.deepEqual(bot.data.profiles, [
      {
        id:       1234,
        location: "baz",
        service:  "barfoo"
      },
      {
        id:       1234,
        location: "corge",
        service:  "foobar"
      },
      {
        id:       5678,
        location: "corge grault",
        service:  "foobar"
      },
      {
        id:       4321,
        location: "bar",
        service:  "foobar"
      },
      {
        id:       1111,
        location: "grault",
        service:  "foobar"
      }
    ])
  })

  it("should remove properties", async function() {
    const messages = []
    const expected = []

    messages[0] = deepCopy(messageTemplate, {
      author:  {id: 1234},
      command: {args: ["remove", "id"]}
    })

    messages[1] = deepCopy(messageTemplate, {
      author:  {id: 1234},
      command: {args: ["remove", "service"]}
    })

    messages[2] = deepCopy(messageTemplate, {
      author:  {id: 1234},
      command: {args: ["remove", "location"]}
    })

    messages[3] = deepCopy(messageTemplate, {
      author:  {id: 1234},
      command: {args: ["remove", "foo"]}
    })

    messages[4] = deepCopy(messageTemplate, {
      author:  {id: 4321},
      command: {args: ["remove"]}
    })

    messages[5] = deepCopy(messageTemplate, {
      author:  {id: 1111},
      command: {args: ["remove"]}
    })

    expected[0] = deepCopy(messages[0])
    
    expected[1] = deepCopy(messages[1])
    
    expected[2] = deepCopy(messages[2], {
      output: "Your location has been removed",
      isReply: true
    })
    
    expected[3] = deepCopy(messages[3])
    
    expected[4] = deepCopy(messages[4], {
      output: "Your profile has been removed",
      isReply: true
    })

    expected[5] = deepCopy(messages[5])

    messages[0] = await profileCmd.default(messages[0], bot)
    messages[1] = await profileCmd.default(messages[1], bot)
    messages[2] = await profileCmd.default(messages[2], bot)
    
    assert.deepEqual(bot.data.profiles, [
      {
        id: 1234,
        location: "baz",
        service: "barfoo"
      },
      {
        id: 1234,
        service: "foobar"
      },
      {
        id: 5678,
        location: "corge",
        service:  "foobar"
      },
      {
        id: 4321,
        location: "bar",
        service: "foobar"
      }
    ])

    messages[3] = await profileCmd.default(messages[3], bot)
    messages[4] = await profileCmd.default(messages[4], bot)

    assert.deepEqual(bot.data.profiles, [
      {
        id: 1234,
        location: "baz",
        service: "barfoo"
      },
      {
        id: 1234,
        service: "foobar"
      },
      {
        id: 5678,
        location: "corge",
        service:  "foobar"
      }
    ])

    messages[5] = await profileCmd.default(messages[5], bot)

    assert.equal(saveData.default.args.length, 2)
    assert.equal(saveData.default.args[0][0], bot.data)
    assert.equal(saveData.default.args[1][0], bot.data)
    assert.deepEqual(messages, expected)

  })

})