'use strict'

require('should')
const Compressor = require('..')

describe('validate compression', function() {
  const smallToCompress = {
    deviceId: '878f4dfb-538c-4736-a555-25d7414fcb96',
    readings: [{
      meaning: 'tem1',
      value: 4.31,
    }],
    received: 1479907331716,
  }

  describe('basic tests', function() {
    it(' -- basic small compression', function(done) {
      const compressor = new Compressor()
      compressor.findKey(smallToCompress)
      const rev = compressor.createKeySet()
      const en = compressor.encode(smallToCompress, rev)
      const de = compressor.decode(en, rev)
      JSON.stringify(smallToCompress).length.should.be.aboveOrEqual((new Buffer(JSON.stringify(de))).length)
      done()
    })

    describe('compression rate', function() {
      const compressor = new Compressor()
      compressor.findKey(smallToCompress)
      const rev = compressor.createKeySet()
      const en = compressor.encode(smallToCompress, rev)
      const de = compressor.decode(en, rev)
      const compRate = 1 - ((new Buffer(en)).length / (new Buffer(JSON.stringify(de))).length)
      console.log(compRate * 100)

      it('20 percent', function(done) {
        compRate.should.be.aboveOrEqual(.2)
        done()
      })
      it('30 percent', function(done) {
        compRate.should.be.aboveOrEqual(.3)
        done()
      })
      it('40 percent', function(done) {
        compRate.should.be.aboveOrEqual(.4)
        done()
      })
      it('50 percent', function(done) {
        compRate.should.be.aboveOrEqual(.5)
        done()
      })
      it('60 percent', function(done) {
        compRate.should.be.aboveOrEqual(.6)
        done()
      })
    })

    it('multiple compression need to have same result', function(done) {
      let d
      this.timeout(2000)
      const compressor = new Compressor()
      compressor.findKey(smallToCompress)
      const rev = compressor.createKeySet()
      for(let i = 0; i < 100; i++) {
        const en = compressor.encode(smallToCompress, rev)
        const de = compressor.decode(en, rev)
        if(d)
          d.should.be.equal(JSON.stringify(de))
        d = JSON.stringify(de)
      }
      done()
    })

    it('big data compression', function(done) {
      const bigToCompress = require('./asserts/complex')
      this.timeout(2000)
      const compressor = new Compressor()
      compressor.findKey(bigToCompress)
      const rev = compressor.createKeySet()
      for(let i = 0; i < 100; i++) {
        const en = compressor.encode(bigToCompress, rev)
        const de = compressor.decode(en, rev)
        JSON.stringify(bigToCompress).should.be.equal(JSON.stringify(de))
      }
      done()
    })
  })

  describe('set and get dictionary', function() {
    it('basic operation', function(done) {
      const compressor = new Compressor()
      compressor.findKey(smallToCompress)
      const rev = compressor.createKeySet()
      const codeBook = compressor.getCodeBook(rev)

      const compressor2 = new Compressor()
      compressor2.setCodeBook(rev, codeBook)
      const en = compressor.encode(smallToCompress, rev)
      const de = compressor2.decode(en, rev)
      const compRate = 1 - ((new Buffer(en)).length / (new Buffer(JSON.stringify(de))).length)
      compRate.should.be.aboveOrEqual(.5)
      done()
    })
  })
})
