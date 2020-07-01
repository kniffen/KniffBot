import assert    from "assert"
import sinon     from "sinon"
import DiscordJS from "discord.js"

import deepCopy        from "../../bot/utils/deepCopy"
import * as saveData   from "../../bot/utils/saveData"
import * as profileCmd from "../../bot/commands/profile"

import mockDiscord from "../utils/mockDiscordClient"

describe("commands/profile()", function() {

  let bot, guild, channel, members, roles

  before(function() {
    sinon.stub(saveData, "default").callsFake(() => { /* ignore */ })

    bot = {
      discord: mockDiscord(),
      data: {
        settings: {
          color: "#FF0000"
        },
        profiles: [
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
      }
    }

    guild   = bot.discord.createGuild({name: "qux"})
    channel = bot.discord.createChannel()
    members = []
    roles   = []

    members[0] = bot.discord.createMember({
      id:       "1234",
      username: "quux",
      presence: {
        status: "online"
      }
    })

    members[1] = bot.discord.createMember({
      id:       "5678",
      username: "corge",
      presence: {
        status: "online"
      }
    })

    roles[0] = bot.discord.createRole({name: "@everyone"})
    roles[1] = bot.discord.createRole({name: "everyone"})
    roles[2] = bot.discord.createRole({name: "someone"})

    members[0].roles.add(roles[0])
    members[0].roles.add(roles[1])
    members[0].roles.add(roles[2])

    members[1].roles.add(roles[0])
    members[1].roles.add(roles[1])
  })
  
  after(function() {
    sinon.restore()
  })

  afterEach(function() {
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
    const messages = []
    const expected = []

    messages[0] = {
      service: "foobar",
      isDM:     false,
      author:   {id: "1234"},
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    messages[1] = {
      service: "foobar",
      isDM:     true,
      author:  {
        id:            1234,
        discriminator: 5,
        username:      "quux",
        avatarURL:     "foo.bar"
      },
      mentions: [],
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    messages[2] = {
      service: "foobar",
      isDM:     true,
      author:  {
        id:            1111,
        discriminator: 7,
        username:      "corge",
        avatarURL:     "qux.quux"
      },
      mentions: [],
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    expected[0] = {
      service:  messages[0].service,
      isDM:     messages[0].isDM,
      author:   messages[0].author,
      original: messages[0].original
    }

    expected[1] = {
      service:  messages[1].service,
      isDM:     messages[1].isDM,
      author:   messages[1].author,
      mentions: messages[1].mentions,
      original: messages[1].original
    }

    expected[2] = {
      service:  messages[2].service,
      isDM:     messages[2].isDM,
      author:   messages[2].author,
      mentions: messages[2].mentions,
      original: messages[2].original
    }

    expected[0].output = new DiscordJS.MessageEmbed({color: 0xFF0000})
    expected[1].output = new DiscordJS.MessageEmbed({color: 0xFF0000})
    expected[2].output = new DiscordJS.MessageEmbed({color: 0xFF0000})

    expected[0].output.setAuthor("Profile for quux", "user-avatar-url")
    expected[0].output.addField("Discriminator",     "#1000",             true)
    expected[0].output.addField("Identifier",        "1234",              true)
    expected[0].output.addField("Status",            "online",            true)
    expected[0].output.addField("Account created",   "January 2, 1970",   true)
    expected[0].output.addField("Joined qux",        "April 26, 1970",    true)
    expected[0].output.addField("Roles",             "everyone, someone", true)

    expected[1].output.setAuthor("Profile for quux", "foo.bar")
    expected[1].output.addField("Discriminator",     "#5",                true)
    expected[1].output.addField("Identifier",        "1234",              true)
    expected[1].output.addField("Location",          "foo",               true)

    expected[2].output.setAuthor("Profile for corge", "qux.quux")
    expected[2].output.addField("Discriminator",      "#7",               true)
    expected[2].output.addField("Identifier",         "1111",             true)

    const actual = await Promise.all([
      profileCmd.default(messages[0], bot),
      profileCmd.default(messages[1], bot),
      profileCmd.default(messages[2], bot)
    ])

    assert.deepEqual(actual, expected)
  })

  it("should output a rich embed of a target user's profile", async function() {
    const message = {
      service: "foobar",
      isDM:     false,
      author:   {id: "1234"},
      mentions: [
        members[1].user
      ],
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    const expected = {
      service:  message.service,
      isDM:     message.isDM,
      author:   message.author,
      mentions: message.mentions,
      original: message.original
    }

    expected.output = new DiscordJS.MessageEmbed({color: 0xFF0000})

    expected.output.setAuthor("Profile for corge", "user-avatar-url")
    expected.output.addField("Discriminator",      "#1001",             true)
    expected.output.addField("Identifier",         "5678",              true)
    expected.output.addField("Status",             "online",            true)
    expected.output.addField("Account created",    "January 2, 1970",   true)
    expected.output.addField("Joined qux",         "April 26, 1970",    true)
    expected.output.addField("Roles",              "everyone", true)

    const actual = await profileCmd.default(message, bot)
  
    assert.deepEqual(actual, expected)
  })

  it("should return a specific error message if the user could not be found", async function() {
    const message = {
      service: "foobar",
      isDM:     false,
      author:   {id: "9999"},
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    const expected = {
      service:  message.service,
      isDM:     message.isDM,
      author:   message.author,
      original: message.original,
      isReply:  true,
      output:   "Unable to find user profile"
    }

    const actual = await profileCmd.default(message, bot)

    assert.deepEqual(actual, expected)
  })

  it("should set the location of a user", async function() {
    const message = {
      service: "foobar",
      isDM:     false,
      author:   {id: "1234"},
      command: {
        args: ["location", "foo", "bar", "baz"]
      },
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    const expected = {
      service:  message.service,
      isDM:     message.isDM,
      author:   message.author,
      command:  message.command,
      original: message.original,
      isReply:  true,
      output:   "Your location is now set to foo bar baz"
    }

    const actual = await profileCmd.default(message, bot)

    assert.deepEqual(bot.data.profiles[1], {
      id:       "1234",
      service:  "foobar",
      location: "foo bar baz"
    })

    assert.deepEqual(actual, expected)

    assert.deepEqual(saveData.default.args, [[bot.data]])
  })

  it("should be able to remove properties", async function() {
    const messages = []
    const expected = []
    const actual   = []

    messages[0] = {
      service: "foobar",
      isDM:     false,
      author:   {id: "1234"},
      command: {
        args: ["remove", "location"]
      },
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    messages[1] = {
      service: "foobar",
      isDM:     false,
      author:   {id: "1234"},
      command: {
        args: ["remove"]
      },
      original: {
        channel: bot.discord.channels.cache.first()
      }
    }

    expected[0] = {
      service:  messages[0].service,
      isDM:     messages[0].isDM,
      author:   messages[0].author,
      command:  messages[0].command,
      original: messages[0].original,
      isReply:  true,
      output:   "Your location has been removed"
    }

    expected[1] = {
      service:  messages[1].service,
      isDM:     messages[1].isDM,
      author:   messages[1].author,
      command:  messages[1].command,
      original: messages[1].original,
      isReply:  true,
      output:   "Your profile has been removed"
    }

    actual[0] = await profileCmd.default(messages[0], bot)

    assert.deepEqual(bot.data.profiles[1], {
      id:       "1234",
      service:  "foobar",
    })
    assert.deepEqual(saveData.default.args[0], [bot.data])

    actual[1] = await profileCmd.default(messages[1], bot)

    assert.deepEqual(bot.data.profiles[1], {
      id:       "5678",
      location: "corge",
      service:  "foobar",
    })
    assert.deepEqual(saveData.default.args[1], [bot.data])

    assert.deepEqual(actual, expected)
  })


})