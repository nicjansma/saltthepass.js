/* global CryptoJS */

//
// saltthepass.js v0.1.0
//
// Copyright 2013 Nic Jansma
// http://nicj.net
//
// https://github.com/nicjansma/saltthepass.js
//
// Licensed under the MIT license
//
(function() {
    'use strict';

    // Module definition
    var SaltThePass = {};

    // determine root object
    var root;
    if (typeof window !== 'undefined') {
        root = window;
    }

    //
    // Constants
    //

    /**
     * Known hash functions
     */
    var HASHES = {
        'md5': {
            length: 22
        },
        'sha1': {
            length: 27
        },
        'sha2': {
            length: 86
        },
        'sha3': {
            length: 86
        },
        'ripemd160': {
            length: 27
        }
    };

    //
    // Members
    //

    /**
     * Whether or not CryptoJS has been initialized
     */
    var hasInit = false;

    /**
     * CryptoJS Base64 function (eg. CryptoJS.enc.Base64)
     */
    var _base64Fn = null;

    //
    // Private Functions
    //

    /**
     * Privately initializes SaltThePass with the CryptoJS library.
     *
     *  @param {function} md5 MD5 function
     *  @param {function} sha1 SHA1 function
     *  @param {function} sha512 SHA512 function
     *  @param {function} sha3 SHA3 function
     *  @param {function} ripemd160 RIPEMD160 function
     *  @param {function} base64 Base64 function
     */
    function initializeFns(md5, sha1, sha512, sha3, ripemd160, base64) {
        hasInit = true;

        // setup hashing functions
        HASHES.md5.fn = md5;
        HASHES.sha1.fn = sha1;
        HASHES.sha2.fn = sha512;
        HASHES.sha3.fn = sha3;
        HASHES.ripemd160.fn = ripemd160;

        // save Base64 Fn
        _base64Fn = base64;
    }

    /**
     *  Tries to initialize functions from the CryptoJS library
     */
    function tryBrowserInitialize() {
        if (typeof(CryptoJS) !== 'undefined') {
            initializeFns(
                CryptoJS.MD5,
                CryptoJS.SHA1,
                CryptoJS.SHA512,
                CryptoJS.SHA3,
                CryptoJS.RIPEMD160,
                CryptoJS.enc.Base64);
        }
    }

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
        if (!hasInit) {
            tryBrowserInitialize();
        }

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
        if (_base64Fn === null ||
            typeof(phrase) === 'undefined' ||
            !phrase.length ||
            !hasInit) {
            return;
        }

        // get the hash's hashing function
        var hashFn = this.getHashFn(hashName);
        if (typeof(hashFn) === 'undefined') {
            return;
        }

        // hash and base-64 encode
        var hashedPhrase = hashFn(phrase);
        var base64 = hashedPhrase.toString(_base64Fn);

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
            masterPassword= '';
        }

        if (typeof(domainName) === 'undefined') {
            domainName= '';
        }

        if (typeof(domainPhrase) === 'undefined') {
            domainPhrase= '';
        }

        return this.hash(hashName, masterPassword + domainName + domainPhrase);
    };

    //
    // If we were loaded via the browser and CryptoJS is already defined, initialize.
    //
    tryBrowserInitialize();

    //
    // Export saltthepass.js to the appropriate location
    //
    if (typeof define !== 'undefined' && define.amd) {
        //
        // AMD / RequireJS
        //
        define([], function () {
            return SaltThePass;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        //
        // Node.js
        //
        module.exports = SaltThePass;

        // load crypto-js module
        if (typeof(require) === 'function') {
            initializeFns(
                require('crypto-js/md5'),
                require('crypto-js/sha1'),
                require('crypto-js/sha512'),
                require('crypto-js/sha3'),
                require('crypto-js/ripemd160'),
                require('crypto-js/enc-base64')
            );
        }
    } else if (typeof root !== 'undefined') {
        //
        // Included directly via a script tag
        //
        root.SaltThePass = SaltThePass;
    }
}());