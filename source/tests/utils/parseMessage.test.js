import assert from "assert"
import sinon  from "sinon"
import moment from "moment-timezone"

import deepCopy     from "../../bot/utils/deepCopy"
import parseMessage from "../../bot/utils/parseMessage"

describe("utils/parseMessage()", function() {

  const format = sinon.spy(() => 1)

  const bot = {
    discord: {
      user: {
        username: "foo"
      }
    },
    settings: {
      prefix: "??"
    }
  }

  before(function() {
    sinon.stub(moment, "utc").returns({format})
  })

  after(function() {
    sinon.restore()
  })

  it("should return a message object no matter what", function() {

    const messages = [
      parseMessage(undefined, undefined,    bot),
      parseMessage("foobar",  undefined,    bot),
      parseMessage("foobar",  {foo: "bar"}, bot)
    ]

    const expected = {
      service:     '',
      input:       '',
      timestamp:   0,
      mentions:    [],
      isMentioned: false,
      isReply:     false,
      isBot:       false,
      isDM:        false,
      isOwner:     false,
      author:      {username: ''},
      self:        {username: ''},
      original:    {}
    }

    assert.equal(format.args[0][0], 'x')

    assert.deepEqual(messages[0], expected)

    assert.deepEqual(messages[1], Object.assign(expected, {
      service:     "foobar",
      timestamp:   1
    }))
    
    assert.deepEqual(messages[2], Object.assign(expected, {
      service:     "foobar",
      timestamp:   1,
      original:    {foo: "bar"}
    }))
  })

  describe("Discord", function() {

    const discordMessage = {
      cleanContent:     '',
      id:               1111,
      createdTimestamp: 2,
      author:           {username: "bar"},
      channel:          {type: "text"},
      member: {
        guild: {
          ownerID: "2222"
        },
        user: {
          id: "3333"
        }
      }
    }

    const expectedTemplate = {
      service:     "discord",
      input:       '',
      cleanInput:  '',
      timestamp:   2,
      mentions:    [],
      emojis:      [],
      isMentioned: false,
      isReply:     false,
      isBot:       false,
      isDM:        false,
      isOwner:     false,
      author:      {username: 'bar'},
      self:        {username: 'foo'},
      original:    deepCopy(discordMessage)
    } 

    it("should parse messages", function() {
      const message = parseMessage("discord", discordMessage, bot)

      assert.deepEqual(message, expectedTemplate)
    })

    it("should parse commands", function() {
      const data = deepCopy(discordMessage, {
        cleanContent: "??foo bar baz"
      })

      const expected = deepCopy(expectedTemplate, {
        input:      "??foo bar baz",
        cleanInput: "??foo bar baz",
        author:   {username: 'bar'},
        command:  {id: "foo", args: ["bar", "baz"]},
        original: {
          cleanContent:     "??foo bar baz",
          id:               1111,
          createdTimestamp: 2,
          author:           {username: "bar"},
        }
      })
  
      const message  = parseMessage("discord", data, bot)

      assert.deepEqual(message, expected)
    })

    it("should parse mentions", function() {
      const data = deepCopy(discordMessage, {
        mentions: {users: [{id: 1234, username: "FooBar"}]}
      })
      const expected = deepCopy(expectedTemplate, {
        mentions: [{id: 1234, username: "FooBar"}],
        original: {
          mentions: {
            users: [{id: 1234, username: "FooBar"}]
          }
        }
      })

      const message  = parseMessage("discord", data, bot)
      
      assert.deepEqual(message, expected)
    })

    it("should parse emotes", function() {
      const data = deepCopy(discordMessage, {
        cleanContent: "foobar <:foo:1234>foo\n bar<:bar:56789>baz"
      })
      const expected = deepCopy(expectedTemplate, {
        input:      "foobar <:foo:1234>foo\n bar<:bar:56789>baz",
        cleanInput: "foobar foo\n barbaz",
        emojis: [
          {
            string: "<:foo:1234>",
            name:   "foo",
            id:     "1234",
            url:    "https://cdn.discordapp.com/emojis/1234.png"
          },
          {
            string: "<:bar:56789>",
            name:   "bar",
            id:     "56789",
            url:    "https://cdn.discordapp.com/emojis/56789.png"
          }
        ],
        original: {
          cleanContent: "foobar <:foo:1234>foo\n bar<:bar:56789>baz"
        }
      })

      const message = parseMessage("discord", data, bot)
      
      assert.deepEqual(message, expected)
    })

    it("should detect bot mentions", function() {
      const data = deepCopy(discordMessage, {
        cleanContent: "@Foo Hello"
      })
      const expected = deepCopy(expectedTemplate, {
        input:      "@Foo Hello",
        cleanInput: "@Foo Hello",
        isMentioned: true,
        original: {
          cleanContent: "@Foo Hello"
        }
      })

      const message = parseMessage("discord", data, bot)
      
      assert.deepEqual(message, expected)
    })

    it("should detect if the message is from a bot", function() {
      const data = deepCopy(discordMessage, {
        author: {username: "Foo"}
      })

      const expected = deepCopy(expectedTemplate, {
        isBot: true,
        author: {username: 'Foo'},
        original: {
          author: {username: "Foo"},
        }
      })

      const message = parseMessage("discord", data, bot)

      assert.deepEqual(message, expected)
    })

    it("should detect if the message is a direct message", function() {
      const data = deepCopy(discordMessage, {
        channel: {type: "dm"}
      })

      const expected = deepCopy(expectedTemplate, {
        isDM:    true,
        isOwner: true,
        original: {
          channel: {type: "dm"}
        }
      })

      const message = parseMessage("discord", data, bot)

      assert.deepEqual(message, expected)
    })

    it("should detect if the message is from he server owner", function() {
      const data = deepCopy(discordMessage, {
        member: {
          user: {
            id: "2222"
          }
        }
      })

      const expected = deepCopy(expectedTemplate, {
        isOwner: true,
        original: {
          member: {
            user: {
              id: "2222"
            }
          }
        }
      })

      const message = parseMessage("discord", data, bot)

      assert.deepEqual(message, expected)
    })

  })

  describe("Twitch IRC", function() {

    const twitchMessage = {
      message: '',
      indet:   "baz",
      time:    3
    }

    const expectedTemplate = {
      service:     "twitchIRC",
      input:       '',
      timestamp:   3,
      isMentioned: false,
      isReply:     false,
      isBot:       false,
      isDM:        false,
      isOwner:     false,
      author:      {username: 'baz'},
      self:        {username: 'bar'},
      mentions:    [],
      original:    {
        message: '',
        indet:   "baz",
        time:    3
      }
    }

    it("should parse messages", function() {
      const message = parseMessage("twitchIRC", twitchMessage, bot)

      assert.deepEqual(message, expectedTemplate)
    })

    it("should parse commands", function() {
      const data = deepCopy(twitchMessage, {message: "??foobar bar baz"})

      const message = parseMessage("twitchIRC", data, bot)

      const expected = deepCopy(expectedTemplate, {
        input:      "??foobar bar baz",
        command: {
          id:   "foobar",
          args: ["bar", "baz"]
        },
        original: {
          message: "??foobar bar baz"
        }
      })

      assert.deepEqual(message, expected)
    })

    it("should parse bot mentions", function() {
      const data = deepCopy(twitchMessage, {message: "@Bar hello"})
      const expected = deepCopy(expectedTemplate, {
        input:       "@Bar hello",
        isMentioned: true,
        original:    {message: "@Bar hello",}
      })
      
      const message = parseMessage("twitchIRC", data, bot)

      assert.deepEqual(message, expected)
    })

    it("should detect if the message is from a bot", function() {
      const data = deepCopy(twitchMessage, {indet: "Bar"})
      const expected = deepCopy(expectedTemplate, {
        author:   {username: 'Bar'},
        isBot:    true,
        original: {
          indet:   "Bar",
        }
      })

      const message = parseMessage("twitchIRC", data, bot)

      assert.deepEqual(message, expected)
    })

    it("should detect if the message is a direct message")

  })

})