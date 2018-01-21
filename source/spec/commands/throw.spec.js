const { expect } = require('chai')
const throwCmd = require('../../lib/commands/throw.js')

describe('commands/throwCmd()', () => {

  it('should throw given arguments', async () => {
    const message = await throwCmd({args: ['foo', 'bar']})

    expect(message).to.deep.equal({
      args: ['foo', 'bar'],
      output: '(╯°□°）╯︵ foo bar'
    })
  })

  it('should return a specific error string if missing arguments', async () => {
    const message = await throwCmd({args: []})

    expect(message).to.deep.equal({
      args: [],
      output: 'Missing arguments, use !throw [string]'
    })
  })

})