const { expect } = require('chai')
const commandsCmd = require('../../lib/commands/commands.js')

describe('commands/commands()', () => {

  const commands = {
    foo: 'bar',
    baz: () => undefined
  }

  it('should return a list of available commands', async () => {
    const message = await commandsCmd({}, commands)

    expect(message).to.deep.equal({
      output: '!foo !baz',
      isCode: true
    })
  })

})