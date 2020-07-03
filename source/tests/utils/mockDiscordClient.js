import DiscordJS from "discord.js"

function createGuild(client, opts = {}) {
  const guild = {
    id:       opts.id       || `guild-id-${client.guilds.cache.size}`,
    name:     opts.name     || `guild-name-${client.guilds.cache.size}`,
    channels: opts.channels || client.channels,
    roles:    opts.roles    || [],
    emojis:   opts.emojis   || [],
    members:  {
      cache: new DiscordJS.Collection(),
      fetch: async (id) => guild.members.cache.get(id.toString())
    },
    roles: {
      cache: new DiscordJS.Collection(),
      fetch: async (id) => guild.roles.cache.get(id.toString())
    }
  }

  client.guilds.cache.set(guild.id.toString(), guild)

  return guild
}

function createChannel(client, opts = {}) {
  const guild = opts.guild || client.guilds.cache.first()

  const channel = {
    id:   opts.id   || `channel-id-${client.channels.cache.size}`,
    type: opts.type || "unknown",
    guild,
    messages: {
      cache: new DiscordJS.Collection(),
      fetch: async (id) => channel.messages.cache.get(id.toString())
    }
  }

  client.channels.cache.set(channel.id.toString(), channel)

  return channel
}

function createUser(client, opts = {}) {
  const guild = opts.guild || client.guilds.cache.first()

  const user = {
    id:               opts.id               || `user-id-${guild.members.cache.size}`,
    discriminator:    opts.discriminator    || `100${guild.members.cache.size}`,
    username:         opts.username         || `username-${guild.members.cache.size}`,
    avatarURL:        opts.avatarURL        || "user-avatar-url",
    createdTimestamp: opts.createdTimestamp || 100000000,
    presence: {
      status: opts.presence?.status || `user-presence-status`
    }
  }

  return user
}

function createMember(client, opts = {}) {
  const guild = opts.guild || client.guilds.cache.first()
  const user  = createUser(client, opts)

  const member = {
    user,
    joinedTimestamp: opts.joinedTimestamp || 10000000000,
    roles: {
      cache:  new DiscordJS.Collection(),
      add:    async (role) => member.roles.cache.set(role.id.toString(), role),
      remove: async (role) => member.roles.cache.delete(role.id)
    }
  }

  guild.members.cache.set(member.user.id.toString(), member)

  return member
}

function createMessage(client, opts = {}) {
  const guild   = opts.guild   || client.guilds.cache.first()
  const channel = opts.channel || client.channels.cache.first()

  const message = {
    id:      opts.id      || `message-id-${channel.messages.cache.size}`,
    type:    opts.type    || "DEFAULT",
    content: opts.content || "this is the message content",
    author:  opts.author,
    member:  opts.member,
    reactions: {
      cache:   new DiscordJS.Collection(),
      resolve: (id) => message.reactions.cache.get(id.toString()),
      removeAll: async () => message.reactions.cache.clear() 
    },
    guild,
    channel
  }

  channel.messages.cache.set(message.id.toString(), message)

  return message
}

function createReaction(client, opts = {}) {
  const channel = opts.channel || client.channels.cache.first()
  const message = opts.message || channel.messages.cache.first()
  const emoji   = opts.emoji   || {id: "😱", name:"😱"}

  const reaction = {
    me:    opts.me    || false,
    count: opts.count || 1,
    emoji: emoji,
    remove: async () => message.reactions.cache.delete(reaction.emoji.id),
    users: {
      cache: new DiscordJS.Collection(),
      fetch: async () => reaction.users.cache
    }
  }

  for (const user of opts.users) reaction.users.cache.set(user.id, user)

  message.reactions.cache.set(reaction.emoji.id, reaction)

  return reaction
}

function createRole(client, opts = {}) {
  const guild = opts.guild || client.guilds.cache.first()

  const role = {
    id:   opts.id   || `role-id-${guild.roles.cache.size}`,
    name: opts.name || `role-name-${guild.roles.cache.size}`,
  }

  guild.roles.cache.set(role.id, role)

  return role
}

export default function mockDiscord() {
  const client = {
    guilds: {
      cache: new DiscordJS.Collection()
    },
    channels: {
      cache: new DiscordJS.Collection(),
      fetch: async (id) => client.channels.cache.get(id.toString())
    }
  }

  client.createGuild    = (opts) => createGuild(client, opts)
  client.createChannel  = (opts) => createChannel(client, opts)
  client.createUser     = (opts) => createUser(client, opts)
  client.createMember   = (opts) => createMember(client, opts)
  client.createMessage  = (opts) => createMessage(client, opts)
  client.createReaction = (opts) => createReaction(client, opts)
  client.createRole     = (opts) => createRole(client, opts)

  return client
}