# saltthepass.js

v0.1.0

Copyright 2013 Nic Jansma

http://nicj.net

Licensed under the MIT license

## Introduction

saltthepass.js is the algorithm that generates salted passwords for [SaltThePass.com](https://saltthepass.com/).

saltthepass.js can be used to build your own app, website or program to generate the same salted password as
[saltthepass.com](https://saltthepass.com) does.

## Download

Releases are available for download from [GitHub](https://github.com/nicjansma/saltthepass.js).

__Development:__ [saltthepass.js](https://github.com/nicjansma/saltthepass.js/raw/master/src/saltthepass.js)
    - 6,861b

__Production (without CryptoJS):__ [saltthepass.min.js](https://github.com/nicjansma/saltthepass.js/raw/master/dist/saltthepass.min.js)
    - 650b (minified / gzipped)

__Production (with CryptoJS built-in):__ [saltthepass.withcryptojs.min.js](https://github.com/nicjansma/saltthepass.js/raw/master/dist/saltthepass.withcryptojs.min.js)
    - 7,658b (minified / gzipped)

saltthepass.js is also available as the [npm saltthepass module](https://npmjs.org/package/saltthepass). You can install
using Node Package Manager (npm):

    npm install saltthepass

## Usage

Please see [SaltThePass.com](https://saltthepass.com/) for a description of how/why you would use salted passwords.

### Requirements

saltthepass.js depends on the [CryptoJS library](http://code.google.com/p/crypto-js/).  SaltThePass is tested to work
with CryptoJS v3.1.2, which is included in the ``deps/crypto-js`` folder.  You will need to load the following
CryptoJS modules in this order prior to loading saltthepass.js:

* crypto-js/core
* crypto-js/x64-core
* crypto-js/sha1
* crypto-js/sha512
* crypto-js/sha3
* crypto-js/md5
* crypto-js/ripemd160
* crypto-js/enc-base64

### Browser - Development Versions

To use un-minified versions of saltthepass.js in the browser, you need to load the files in this order:

```html
<script type="text/javascript" src="deps/crypto-js/core.js"></script>
<script type="text/javascript" src="deps/crypto-js/x64-core.js"></script>
<script type="text/javascript" src="deps/crypto-js/sha1.js"></script>
<script type="text/javascript" src="deps/crypto-js/sha512.js"></script>
<script type="text/javascript" src="deps/crypto-js/sha3.js"></script>
<script type="text/javascript" src="deps/crypto-js/md5.js"></script>
<script type="text/javascript" src="deps/crypto-js/ripemd160.js"></script>
<script type="text/javascript" src="deps/crypto-js/enc-base64.js"></script>
<script type="text/javascript" src="src/saltthepass.js"></script>
```

### Browser - Minified Versions

There are two minified versions of saltthepass.js provided in the ``dist/`` folder:

* ``saltthepass.min.js`` - Does not include CryptoJS
* ``saltthepass.withcryptojs.min.js`` - Include CryptoJS

If your site already has the required CryptoJS modules loaded, you can use ``saltthepass.min.js``.

If you are not already using CryptoJS and do not need to add additional CryptoJS modules, you can use
``saltthepass.withcryptojs.min.js``.

### NodeJS

To use saltthepass.js in NodeJS, you just need to install:

    npm install saltthepass

Then ``require()`` it:

```js
var saltthepass = require('saltthepass');
var saltedPassword = saltthepass.saltthepass('md5', 'mypassword', 'mydomain', 'myphrase');
```

### Examples

First, load saltthepass.js in the browser:

```html
<script type="text/javascript" src="dist/saltthepass.withcryptojs.min.js"></script>
```

or in Node:

```js
var saltthepass = require('saltthepass');
```

Next, you can get a list of available hashes:

```js
var hashes = saltthepass.getHashes();
```

This will be a list of strings, such as `md5`, `sha3`, etc.  You can get additional data about the hashes via 
[``saltthepass.getHashFn()``](#getHashFn) and [``saltthepass.getHashLength()``](#getHashLength).

To generate a salted password, you simply call [``saltthepass.saltthepass()``](#saltthepass) with the master password,
domain name and (optional) domain phrase:

```js
var saltedPassword = saltthepass.saltthepass('md5', 'mypassword', 'domain.com', 'domain phrase');
```

## Documentation

<a name="getHashes" />
### getHashes()

Gets a list of supported hashes.

__Returns__

A list of supported hash names.

For example: ``['md5', 'sha1', 'sha2', 'sha3', 'ripemd160']``

<a name="getHashFn" />
### getHashFn(hashName)

Gets the [CryptoJS](http://code.google.com/p/crypto-js/) hash function for a specific hash.

__Arguments__

* `hashName` - Name of the hash, eg `md5`

__Returns__

Hashing function.

<a name="getHashLength" />
### getHashLength(hashName)

Gets the number of Base64 characters the hash function will return.

__Arguments__

* `hashName` - Name of the hash, eg `md5`

__Returns__

Number of characters of the hash.

<a name="hash" />
### hash(hashName, phrase)

Hashes the specified phrase.

__Arguments__

* `hashName` - Name of the hash, eg `md5`
* `phrase` - Phrase to hash

__Returns__

The Base64 encoded hashed phrase.

<a name="saltthepass" />
### saltthepass(hashName, masterPassword, domainName, domainPhrase)

Generates a salted password identical to saltthepass.com.

__Arguments__

* `hashName` - Name of the hash, eg `md5`
* `masterPassword` - Master password
* `domainName` - Domain name
* `domainPhrase` - Domain phrase (optional)

__Returns__

The salted password.

## Tests

saltthepass.js tests are provided in the ``test/`` directory, and can be run via ``nodeunit``:

    nodeunit test/test.js

Or via ``grunt``:

    grunt test

The tests can also be run in a web browser:

    test/test.html

## Version History

* v0.0.1 - 2013-05-22: Initial version
