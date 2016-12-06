'use strict'
const escapeStringRegexp = require('escape-string-regexp')
const crypto = require('crypto')

class Compressor {
  constructor(opts) {
    this.keySetLimit = opts && opts.keySetLimit? opts.keySetLimit: 500
    this.keySetBook = {}
    this.inProgressKeySet = {}
  }
  mergeKeySets(a, b) {
    Object.keys(b).forEach((k) => a[k] = !!a[k] ? a[k] + b[k] : b[k])
    return a
  }

  findKey(toCompress) {
    const key = {}
    let keyArray = Object.keys(this.inProgressKeySet).map((i) => [i, this.inProgressKeySet[i]])
    const keySet = {}

    JSON.stringify(toCompress)
    .match(new RegExp('(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*")|true|false)', 'g'))
    .sort((a, b) => b.length - a.length)
    .forEach((i) => key[i] = (key[i] || 0) + 1)
    Object.keys(key).forEach((a) => {
      if(a.length > 4) {
        let found = false
        keyArray = keyArray.map((i) => {
          if(i[0] === a) {
            found = true
            return [i[0], i[1] + (key[a] * a.length)]
          }
          return i
        })
        if(!found) {
         keyArray.push([a, key[a] * a.length])
        }
      }
    })

    keyArray
    .sort((a, b) => b[1] - a[1])
    .slice(0, this.keySetLimit)
    .map((a) => keySet[a[0]] = a[1])
    this.inProgressKeySet = keySet
  }

  _setDicRegex(codeBook) {
    codeBook.codeBookRegex = new RegExp(Object.keys(codeBook.dic).map((k) => escapeStringRegexp(k)).join('|'), 'g'),
    codeBook.revCodeBookRegex = new RegExp(Object.keys(codeBook.revDic).map((k)=>escapeStringRegexp(k)).join('|'), 'g')
  }

  createKeySet() {
    const revision = crypto.randomBytes(10)
    const dictionary = {}
    const reverseDictionary = {}
    let pC = 10
    Object.keys(this.inProgressKeySet).forEach((k) => {
      const rand = String.fromCharCode(31) + String.fromCharCode(pC)
      pC += 1
      dictionary[k] = rand
      reverseDictionary[rand] = k
    })
    this.keySetBook[revision] = {
      dic: dictionary,
      revDic: reverseDictionary,
    }
    this._setDicRegex(this.keySetBook[revision])
    return revision
  }

  encode(obj, revision) {
    const codeBook = this.keySetBook[revision].dic
    return JSON.stringify(obj).toString()
    .replace(this.keySetBook[revision].codeBookRegex, (m) => codeBook[m])
  }

  decode(str, revision) {
    const codeBook = this.keySetBook[revision].revDic
    return JSON.parse(str.toString().replace(this.keySetBook[revision].revCodeBookRegex, (m) => codeBook[m]))
  }

  getCodeBook(revision) {
    return this.keySetBook[revision].dic
  }

  setCodeBook(revision, dic) {
    this.keySetBook[revision] = {
      dic: dic,
      revDic: {},
    }

    Object.keys(dic).forEach((i) => this.keySetBook[revision].revDic[this.keySetBook[revision].dic[i]] = i)
    this._setDicRegex(this.keySetBook[revision])
  }
}

module.exports = Compressor
