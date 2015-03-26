# saltthepass.js

v0.2.2

Copyright 2015 Nic Jansma

http://nicj.net

Licensed under the MIT license

## Introduction

saltthepass.js is the algorithm that generates salted passwords for [SaltThePass.com](https://saltthepass.com/).

saltthepass.js can be used to build your own app, website or program to generate the same salted passwords as
[saltthepass.com](https://saltthepass.com) does.

## Download

Releases are available for download from [GitHub](https://github.com/nicjansma/saltthepass.js).

__Development:__ [src/* folder](https://github.com/nicjansma/saltthepass.js/raw/master/src/)
    ~ 17kb total

__Production (without CryptoJS):__ [saltthepass.min.js](https://github.com/nicjansma/saltthepass.js/raw/master/dist/saltthepass.min.js)
    ~ 1.5kb (minified / gzipped)

__Production (with CryptoJS built-in):__ [saltthepass.withdeps.min.js](https://github.com/nicjansma/saltthepass.js/raw/master/dist/saltthepass.withdeps.min.js)
    ~ 8.5kb (minified / gzipped)

saltthepass.js is also available as the [npm saltthepass module](https://npmjs.org/package/saltthepass). You can install it
using Node Package Manager (npm):

    npm install saltthepass

## Usage

Please see [SaltThePass.com](https://saltthepass.com/) for a description of how/why you would use salted passwords.

### Requirements

saltthepass.js depends on the [CryptoJS library](http://code.google.com/p/crypto-js/).  SaltThePass is tested to work
with CryptoJS v3.1.2, which can be installed via the bower `cryptojslib` package.

You will need to load the following CryptoJS modules in this order prior to using `saltthepass.js`, if not using one of
the pre-built versions in `dist/` such as `saltthepass.withdeps.js` or `saltthepass.withdeps.min.js`:

* crypto-js/core
* crypto-js/x64-core
* crypto-js/sha1
* crypto-js/sha512
* crypto-js/sha3
* crypto-js/md5
* crypto-js/ripemd160
* crypto-js/enc-base64

### Browser - Development Versions

To use un-minified versions of saltthepass.js in the browser, you need to have the `cryptojslib` bower package:

    bower install cryptojslib

Then load the files in this order:

```html
<script type="text/javascript" src="deps/crypto-js/core.js"></script>
<script type="text/javascript" src="deps/crypto-js/x64-core.js"></script>
<script type="text/javascript" src="deps/crypto-js/sha1.js"></script>
<script type="text/javascript" src="deps/crypto-js/sha512.js"></script>
<script type="text/javascript" src="deps/crypto-js/sha3.js"></script>
<script type="text/javascript" src="deps/crypto-js/md5.js"></script>
<script type="text/javascript" src="deps/crypto-js/ripemd160.js"></script>
<script type="text/javascript" src="deps/crypto-js/enc-base64.js"></script>
<script type="text/javascript" src="src/util.js"></script>
<script type="text/javascript" src="src/domainnamerule.js"></script>
<script type="text/javascript" src="src/saltthepass.js"></script>
```

The file `dist/saltthepass.withdeps.js` is a single JavaScript file with all of the above components in the correct 
order, so it can be used instead if desired:

```html
<script type="text/javascript" src="dist/saltthepass.withdeps.js"></script>
```

### Browser - Minified Versions

There are two minified versions of saltthepass.js provided in the `dist/` folder:

* `saltthepass.min.js` - Does not include CryptoJS
* `saltthepass.withdeps.min.js` - Includes CryptoJS

If your site already has the required CryptoJS modules loaded, you can use `saltthepass.min.js`.

If you are not already using CryptoJS, you can use `saltthepass.withdeps.min.js`.

### NodeJS

To use saltthepass.js in NodeJS, you just need to install:

    npm install saltthepass

Then `require()` it:

```js
var saltthepass = require('saltthepass');
var saltedPassword = saltthepass.saltthepass('md5', 'mypassword', 'mydomain', 'myphrase');
```

### Examples

#### Using SaltThePass

First, load saltthepass.js in the browser:

```html
<script type="text/javascript" src="dist/saltthepass.withdeps.min.js"></script>
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
[`saltthepass.getHashFn()`](#getHashFn) and [`saltthepass.getHashLength()`](#getHashLength).

To generate a salted password, you simply call [`saltthepass.saltthepass()`](#saltthepass) with the master password,
domain name and (optional) domain phrase:

```js
var saltedPassword = saltthepass.saltthepass('md5', 'mypassword', 'domain.com', 'domain phrase');
```

#### Using DomainNameRules

After getting your `saltthepass` object (see above), create a new [`DomainNameRule`](#DomainNameRule):

```js
var dnr = new saltthepass.DomainNameRule({
    domain: 'foo.com',
    aliases: ['a.foo.com', 'b.foo.com'],
    min: 8,
    max: 16,
    regex: 'A-Z0-9'
});
```

Now that you have a [`DomainNameRule`](#DomainNameRule), you can see if it matches your domain, if your password
is valid, and have it attempt to automatically rewrite your password if not:

```js
if (dnr.matches('foo.com')) {
    if (!dnr.isValid('mypassword')) {
        var myNewPassword = dnr.rewrite('mypassword');
    }
}
```

## Documentation

<a name="getHashes" />
### saltthepass.getHashes()

Gets a list of supported hashes.

__Returns__

A list of supported hash names.

For example: `['md5', 'sha1', 'sha2', 'sha3', 'ripemd160']`

<a name="getHashFn" />
### saltthepass.getHashFn(hashName)

Gets the [CryptoJS](http://code.google.com/p/crypto-js/) hash function for a specific hash.

__Arguments__

* `hashName` - Name of the hash, eg `md5`

__Returns__

Hashing function.

<a name="getHashLength" />
### saltthepass.getHashLength(hashName)

Gets the number of Base64 characters the hash function will return.

__Arguments__

* `hashName` - Name of the hash, eg `md5`

__Returns__

Number of characters of the hash.

<a name="hash" />
### saltthepass.hash(hashName, phrase)

Hashes the specified phrase.

__Arguments__

* `hashName` - Name of the hash, eg `md5`
* `phrase` - Phrase to hash

__Returns__

The Base64 encoded hashed phrase.

<a name="saltthepass" />
### saltthepass.saltthepass(hashName, masterPassword, domainName, domainPhrase)

Generates a salted password identical to saltthepass.com.

__Arguments__

* `hashName` - Name of the hash, eg `md5`
* `masterPassword` - Master password
* `domainName` - Domain name
* `domainPhrase` - Domain phrase (optional)

__Returns__

The salted password.

<a name="standardizeDomain" />
### saltthepass.standardizeDomain(url)

Standardizes a domain name for use with <a href="#DomainNameRule">DomainNameRules</a>.

For example, will take `http://foo.com/path` and return `foo.com`.

__Arguments__

* `url` - URL

__Returns__

Standardized domain for use in <a href="#DomainNameRule">DomainNameRules</a>.

<a name="DomainNameRule" />
### saltthepass.DomainNameRule(data)

Creates a Domain Name Rule.

__Arguments__

* `data` - Can contain any of the following options:
    * `domain` - Domain name (eg. `'foo.com'`)
    * `aliases` - Array of additional domain names that will match (eg. `['a.foo.com', 'b.foo.com']`)
    * `description` - Description
    * `min` - Minimum number of characters in the password
    * `max` - Maximum number of characters in the password
    * `invalid` - An array of characters that are not allowed in the password (eg. `['!', '_']`)
    * `required` - An array of characters where one of the characters needs to be in the password (eg. `['-', '!']`)
    * `validregex` - A simplified regular expression that would fit in a character set (eg. `A-Z0-9`, which would fit in
        `[A-Z0-9]`).  The regular expression is run case-sensitive. `validregex` should be used in preference over
        `regex` (which can contain full regular expressions, not just a character sets), as `validregex` can easily
        be inverted (eg `[^A-Z0-9]`) so passwords can be rewritten if they contain invalid characters. 
    * `regex` - A full regular expression that the password must match. The regex is run case-sensitive.

__Returns__

A DomainNameRule class.

<a name="DomainNameRule.matches" />
### DomainNameRule.matches(domain)

Determines whether or not the Domain Name Rule matches the specified domain.

__Arguments__

* `domain` - Domain to match against

__Returns__

True if the Domain Name Rule matches the domain.

<a name="DomainNameRule.isValid" />
### DomainNameRule.isValid(password)

Determines whether or not the Domain Name Rule would pass for the specified password.

__Arguments__

* `password` - Password to check

__Returns__

True if the Domain Name Rule would pass for the specified password.

<a name="DomainNameRule.rewrite" />
### DomainNameRule.rewrite(password)

Attempts to rewrite the password (in a stable and consistent manner) to match the Domain Name Rule.

__Arguments__

* `password` - Password to rewrite

__Returns__

Rewritten password if possible.  Otherwise, `undefined`.

## Tests

saltthepass.js tests are provided in the `test/` directory, and can be run via `nodeunit`:

    nodeunit test/test.js

Or via `grunt`:

    grunt test

The tests can also be run in a web browser:

    test/test.html

## Version History

* v0.1.0 - 2013-05-22: Initial version
* v0.2.0 - 2013-07-16: `DomainNameRule` and `standardizeDomain()` added. 
* v0.2.1 - 2013-07-17: `DomainNameRule.validregex` added
* v0.2.2 - 2013-07-17: `DomainNameRule.validregex` and `DomainNameRule.regex` are case-sensitive now
