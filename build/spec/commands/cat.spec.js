'use strict';

var _require = require('chai'),
    expect = _require.expect;

var cat = require('../../lib/commands/cat.js');

describe('commands/cat', function () {

  it('should return a cat image', async function () {
    var fetch = async function fetch(url) {
      return {
        json: async function json() {
          return { file: 'foo' };
        }
      };
    };

    expect((await cat({}, fetch))).to.deep.equal({
      output: 'foo',
      isFile: true
    });
  });

  it('should return a default image if there\'s none', async function () {
    var fetch = async function fetch(url) {
      return {
        json: async function json() {
          return {};
        }
      };
    };

    expect((await cat({}, fetch))).to.deep.equal({
      output: 'http://i.imgur.com/Bai6JTL.jpg',
      isFile: true
    });
  });
});