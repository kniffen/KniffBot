const chai = require('chai')
const { expect } = chai
const spies = require('chai-spies')
const xkcd = require('../../lib/commands/xkcd.js')

chai.use(spies)

describe('commands/xkcd()', () => {

  const fetch = chai.spy(async () => ({
    json: async () => ({img: 'foo'})
  }))

  it('should return the latest XKCD', async () => {
    expect(await xkcd({args: []}, fetch)).to.deep.equal({
      output: 'foo', 
      args: [],
      isFile: true
    })
    expect(fetch).to.have.been.called.with('https://xkcd.com/info.0.json')

  })

  it('should return a specific XKCD', async () => {
    expect(await xkcd({args: [123]}, fetch)).to.deep.equal({
      output: 'foo',
      args: [123],
      isFile: true
    })
    expect(fetch).to.have.been.called.with('https://xkcd.com/123/info.0.json')

  })

})