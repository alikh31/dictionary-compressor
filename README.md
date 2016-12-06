# Dictionary compressor

Tool to help you to create code book, encode and decode json object base on word usage in both keys and values.

## Installation

`npm install --save dictionary-compressor`

## Usage

First you need to initialize the compressor object

``` javascript
const Compressor = require('dictionary-compressor')
const compressor = new Compressor()
```

`keySetLimit` can be set by passing it to constructor: `new Compressor({keySetLimit: 1000})`. default value is 500 (length of the dictionary)

then you can feed the compressor some data to train the dictionary base on your word uses on your object's keys and values:

``` javascript
compressor.findKey(obj)
```

after running find key on your training period you can generate a code book:

``` javascript
const rev = compressor.createKeySet()
```

`createKeySet` will return revision id for generated code book(dictionary), you can start encoding and decoding base on revision id:

``` javascript
const encoded = compressor.encode(obj, rev)

const decoded = compressor.decode(encoded, rev)
```

also code book can be retrieved and set:

``` javascript
const compressor = new Compressor()
compressor.findKey(obj)
const rev = compressor.createKeySet()
const codeBook = compressor.getCodeBook(rev)

const compressor2 = new Compressor()
compressor2.setCodeBook(rev, codeBook)
// start decoding with compressor2
```
