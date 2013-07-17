//
// SaltThePass
//
// Copyright 2013 Nic Jansma
// http://nicj.net
//
// https://github.com/nicjansma/saltthepass.js
//
// Licensed under the MIT license
//
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(
            [
                'saltthepass/domainnamerule',
                'saltthepass/utils',
                'crypto-js/md5',
                'crypto-js/sha1',
                'crypto-js/sha512',
                'crypto-js/sha3',
                'crypto-js/ripemd160',
                'crypto-js/enc-base64'
            ],
            factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.

        var modulePath = '';
        try {
            require('crypto-js/md5');
        } catch (e) {
            // If we're in Appcelerator's environment, they don't support
            // node_module loading, try to load it from our current path.
            modulePath = '../node_modules/';
        }

        module.exports = factory(
            require('./domainnamerule'),
            require('./utils'),
            require(modulePath + 'crypto-js/md5'),
            require(modulePath + 'crypto-js/sha1'),
            require(modulePath + 'crypto-js/sha512'),
            require(modulePath + 'crypto-js/sha3'),
            require(modulePath + 'crypto-js/ripemd160'),
            require(modulePath + 'crypto-js/enc-base64'));
    } else {
        // Browser globals (root is window)
        root.SaltThePass = factory(
            root.DomainNameRule,
            root.SaltThePassUtils,
            root.CryptoJS.MD5,
            root.CryptoJS.SHA1,
            root.CryptoJS.SHA512,
            root.CryptoJS.SHA3,
            root.CryptoJS.RIPEMD160,
            root.CryptoJS.enc.Base64);
    }
}(this, function (DomainNameRule, utils, md5Fn, sha1Fn, sha512Fn, sha3Fn, ripemd160Fn, base64Fn) {
    'use strict';

    // Module definition
    var SaltThePass = {};

    // export DNR
    SaltThePass.DomainNameRule = DomainNameRule;

    // export utils
    SaltThePass.standardizeDomain = utils.standardizeDomain;

    //
    // Constants
    //

    /**
     * Known hash functions
     */
    var HASHES = {
        'md5': {
            length: 22,
            fn: md5Fn
        },
        'sha1': {
            length: 27,
            fn: sha1Fn
        },
        'sha2': {
            length: 86,
            fn: sha512Fn
        },
        'sha3': {
            length: 86,
            fn: sha3Fn
        },
        'ripemd160': {
            length: 27,
            fn: ripemd160Fn
        }
    };

    //
    // Public functions
    //

    /**
     * Gets a list of the available hash names.
     *
     * @return {string[]} List of hash names
     */
    SaltThePass.getHashes = function getHashes() {
        var hashes = [];

        for (var hash in HASHES) {
            if (HASHES.hasOwnProperty(hash)) {
                hashes.push(hash);
            }
        }

        return hashes;
    };

    /**
     * Gets a hash's hashing function by its name.
     *
     * Will return undefined if CryptoJS cannot be found.
     *
     * @param {string} hashName Hash name
     *
     * @return {function|undefined} Hash's hashing function
     */
    SaltThePass.getHashFn = function getHashFn(hashName) {
        if (!(hashName in HASHES)) {
            return;
        }

        return HASHES[hashName].fn;
    };

    /**
     * Gets a hash's output length by its name.
     *
     * @param {string} hashName Hash name
     *
     * @return {number} Hash output length, or 0 on error
     */
    SaltThePass.getHashLength = function getHashLength(hashName) {
        if (!(hashName in HASHES)) {
            return 0;
        }

        return HASHES[hashName].length;
    };

    /**
     * Hashes a phrase.
     *
     * @param {string} hashName Hash name
     * @param {string} phrase Phrase to hash
     *
     * @return {string|undefined} Hashed phrase or undefined on error
     */
    SaltThePass.hash = function hash(hashName, phrase) {
        // we need to have been initialized first
        if (typeof(phrase) === 'undefined' ||
            !phrase.length) {
            return;
        }

        // get the hash's hashing function
        var hashFn = this.getHashFn(hashName);
        if (typeof(hashFn) === 'undefined') {
            return;
        }

        // hash and base-64 encode
        var hashedPhrase = hashFn(phrase);
        var base64 = hashedPhrase.toString(base64Fn);

        // remove trailing ==s from base64
        base64 = base64.replace(/=+$/, '');

        //
        // NOTE: For base64, we use the base64url variation of RFC 4648 , which replaces the
        // last two characters of plus "+" and forward-slash "/" with minus "-" and underscore "_" to
        // produce Salted Passwords that are more likely to pass the password requirements of sites that
        // limit the characters that can be used in a password.  CryptoJS's Base64 doesn't do this, so we
        // patch the base64 output here.
        //
        base64 = base64.replace(/\+/g, '-');
        base64 = base64.replace(/\//g, '_');

        return base64;
    };

    /**
     * Salts a password based on their hash, master password, domain name
     * and (optionally) domain phrase.
     *
     * @param {string} hashName Hash name
     * @param {string} masterPassword Master password
     * @param {string} domainName Domain name
     * @param {string} domainPhrase Domain phrase (optional)
     *
     * @return {string|undefined} Hashed phrase or undefined on error
     */
    SaltThePass.saltthepass = function saltthepass(hashName, masterPassword, domainName, domainPhrase) {
        // change any undefineds to ''s
        if (typeof(masterPassword) === 'undefined') {
            masterPassword = '';
        }

        if (typeof(domainName) === 'undefined') {
            domainName = '';
        }

        if (typeof(domainPhrase) === 'undefined') {
            domainPhrase = '';
        }

        return this.hash(hashName, masterPassword + domainName + domainPhrase);
    };

    // export
    return SaltThePass;
}));
