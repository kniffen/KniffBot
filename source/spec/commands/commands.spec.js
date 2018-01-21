const { expect } = require('chai')
const commands = require('../../lib/commands/commands.js')

describe('commands/commands()', () => {

  const state = {
    commands: {
      foo: 'bar',
      baz: () => undefined
    }
  }

  it('should return a list of available commands', async () => {
    const message = await commands({}, state)

    expect(message).to.deep.equal({
      output: '!foo !baz',
      isCode: true
    })
  })

})