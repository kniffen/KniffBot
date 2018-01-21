const { expect } = require('chai')
const cat = require('../../lib/commands/cat.js')

describe('commands/cat', () => {
  
  it('should return a cat image', async () => {
    const fetch = async url => ({
      json: async () => ({file: 'foo'})
    })
    
    expect(await cat({}, fetch)).to.deep.equal({
      output: 'foo', 
      isFile: true
    })
  })

  it('should return a default image if there\'s none', async () => {
    const fetch = async url => ({
      json: async () => ({})
    })
    
    expect(await cat({}, fetch)).to.deep.equal({
      output: 'http://i.imgur.com/Bai6JTL.jpg', 
      isFile: true
    })
  })

})