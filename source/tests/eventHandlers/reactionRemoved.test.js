import assert from "assert"
import sinon  from "sinon"

import reactionRemoved from "../../bot/eventHandlers/reactionRemoved"

import mockDiscord from "../utils/mockDiscordClient"

describe("eventHandlers/reactionRemoved()", function() {

  const members = []
  
  before(async function() {
    sinon.stub(console, "error").callsFake(() => { /* ignore */ })

    const bot = {
      data: {
        cachedMessages: [
          {
            channelID: "123456789",
            messageID: "987654321",
            roleReactions: [
              {roleID: "1234", emojiID: "5678"}
            ]
          }
        ]
      }
    }
    
    const client  = mockDiscord()
    const guild   = client.createGuild()
    const channel = client.createChannel({id: "123456789"})
    
    members[0] = client.createMember()
    members[1] = client.createMember()
    members[2] = client.createMember({bot: true})

    const role    = client.createRole({id:"1234", name: "foobar"})
    const message = client.createMessage({id: "987654321", user: members[0].user}) 
    
    const reaction = client.createReaction({
      emoji: {id: "5678", name: "😱"},
      users: [members[0].user]
    })

    members[0].roles.add(role)
    members[2].roles.add(role)

    bot.discord = client

    await Promise.all([
      reactionRemoved(reaction,  members[0].user, bot),
      reactionRemoved(reaction,  members[1].user, bot),
      reactionRemoved(reaction,  members[2].user, bot),
      reactionRemoved(undefined, members[0].user, bot),
      reactionRemoved(reaction,  undefined,       bot),
      reactionRemoved(reaction,  members[0].user, undefined)
    ])
  })

  after(function() {
    sinon.restore()
  })

  it("Should remove roles to users if the reaction is tied to a role", function() {
    assert.deepEqual(members[0].roles.cache.array(), [])
    assert.deepEqual(members[1].roles.cache.array(), [])
    assert.deepEqual(members[2].roles.cache.array(), [{id: "1234", name: "foobar"}])
  })

})