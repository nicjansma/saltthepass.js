/* eslint-env node,browser,amd */
//
// SaltThePass - Utilities
//
// Copyright 2013 Nic Jansma
// http://nicj.net
//
// https://github.com/nicjansma/saltthepass.js
//
// Licensed under the MIT license
//
(function(root, factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.SaltThePassUtils = factory();
    }
}(this, function() {
    "use strict";

    // Module definition
    var Utils = {};

    /**
     * Standardizes a domain for searching (lower cases, strips
     * protocol, etc)
     *
     * @param {string} domain name
     *
     * @returns {string} Standardized domain
     */
    Utils.standardizeDomain = function(domain) {
        if (typeof domain === "undefined") {
            return "";
        }

        // lower first
        var dom = domain.toLowerCase();

        // clean up prefixes
        if (dom.substring(0, "http://".length) === "http://") {
            dom = dom.substring("http://".length);
        }

        if (dom.substring(0, "https://".length) === "https://") {
            dom = dom.substring("https://".length);
        }

        // remove everything after a trailing slash
        if (dom.indexOf("/") !== -1) {
            dom = dom.substring(0, dom.indexOf("/"));
        }

        return dom;
    };

    // export
    return Utils;
}));

/* eslint-env node,browser,amd */
//
// SaltThePass - DomainNameRule
//
// Copyright 2013 Nic Jansma
// http://nicj.net
//
// https://github.com/nicjansma/saltthepass.js
//
// Licensed under the MIT license
//
(function(root, factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["./utils"], factory);
    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require("./utils"));
    } else {
        // Browser globals (root is window)
        root.DomainNameRule = factory(root.SaltThePassUtils);
    }
}(this, function(utils) {
    "use strict";

    //
    // Constructor
    //
    /**
     * Creates a new DomainNameRule
     *
     * @param {object} data Parameters
     */
    function DomainNameRule(data) {
        if (typeof (data) === "undefined") {
            return;
        }

        //
        // matches
        //
        this.domain = data.domain;

        if (data.aliases instanceof Array) {
            this.aliases = data.aliases.slice();
        } else {
            this.aliases = [];
        }

        // description (versions)
        this.description = data.description;

        //
        // rules
        //
        this.min = (typeof data.min !== "undefined") ? (parseInt(data.min, 10) || 0) : 0;
        this.max = (typeof data.max !== "undefined") ? (parseInt(data.max, 10) || Number.MAX_VALUE) : Number.MAX_VALUE;
        this.invalid = (typeof data.invalid !== "undefined") ? data.invalid : "";
        this.required = (typeof data.required !== "undefined") ? data.required : "";

        this.regex = data.regex;
        this.validregex = data.validregex;
    }

    /**
     * Determines if the domain has a minimum number of characters
     *
     * @returns {boolean} True if there is a minimum number of characters
     */
    DomainNameRule.prototype.hasMin = function() {
        return this.min !== 0;
    };

    /**
     * Determines if the domain has a maximum number of characters
     *
     * @returns {boolean} True if the domain has a maximum number of characters
     */
    DomainNameRule.prototype.hasMax = function() {
        return this.max !== Number.MAX_VALUE;
    };

    /**
     * Determines if the domain has specific required characters
     *
     * @returns {boolean} True if the domain has specific required characters
     */
    DomainNameRule.prototype.hasRequired = function() {
        return this.required.length !== 0;
    };

    /**
     * Determines if the domain has a list of invalid characters
     *
     * @returns {boolean} True if the domain has a list of invalid characters
     */
    DomainNameRule.prototype.hasInvalid = function() {
        return this.invalid.length !== 0;
    };

    /**
     * Determines if the domain has a regular expression that must match
     *
     * @returns {boolean} True if the domain has a regular expression that must match
     */
    DomainNameRule.prototype.hasRegex = function() {
        return typeof this.regex !== "undefined";
    };

    /**
     * Determines if the domain has a regular expression of valid characters
     *
     * @returns {boolean} True if the domain has a regular expression of valid characters
     */
    DomainNameRule.prototype.hasValidRegex = function() {
        return typeof this.validregex !== "undefined";
    };

    /**
     * Determines if the specified domain matches this rule's domain
     * or one of its aliases.
     *
     * @param {string} domain Domain to check
     *
     * @returns {boolean} True if the domain matches
     */
    DomainNameRule.prototype.matches = function(domain) {
        // standardize first
        var dom = utils.standardizeDomain(domain);

        // check primary domain
        if (dom === this.domain) {
            return true;
        }

        // check aliases
        for (var i = 0; i < this.aliases.length; i++) {
            var alias = this.aliases[i];
            if (alias === dom) {
                return true;
            }
        }

        return false;
    };

    /**
     * Determines if the password matches the domain's
     * rules.
     *
     * @param {string} password Password
     *
     * @returns {boolean} True if the password matches the domain's rules
     */
    DomainNameRule.prototype.isValid = function(password) {
        if (!this.isValidMin(password)) {
            return false;
        }

        if (!this.isValidMax(password)) {
            return false;
        }

        if (!this.isValidRequired(password)) {
            return false;
        }

        if (!this.isValidInvalid(password)) {
            return false;
        }

        if (!this.isValidRegex(password)) {
            return false;
        }

        if (!this.isValidValidRegex(password)) {
            return false;
        }

        return true;
    };

    /**
     * Determines if the password passes this rule's minimum number of characters
     *
     * @param {string} password Password
     *
     * @returns {boolean} True if the password passes this rule's minimum number of characters
     */
    DomainNameRule.prototype.isValidMin = function(password) {
        return (password.length >= this.min);
    };

    /**
     * Determines if the password passes this rule's maximum number of characters
     *
     * @param {string} password Password
     *
     * @returns {boolean} True if the password passes this rule's maximum number of characters
     */
    DomainNameRule.prototype.isValidMax = function(password) {
        return (password.length <= this.max);
    };

    /**
     * Determines if the password passes this rule's required characters
     *
     * @param {string} password Password
     *
     * @returns {boolean} True if the password passes this rule's required characters
     */
    DomainNameRule.prototype.isValidRequired = function(password) {
        if (this.required.length === 0) {
            return true;
        }

        var foundMatch = false;
        for (var i = 0; i < this.required.length; i++) {
            if (password.indexOf(this.required[i]) !== -1) {
                foundMatch = true;
                break;
            }
        }

        if (this.required.length > 0 && !foundMatch) {
            return false;
        }

        return true;
    };

    /**
     * Determines if the password passes this rule's invalid characters list
     *
     * @param {string} password Password
     *
     * @returns {boolean} True if the password passes this rule's invalid characters list
     */
    DomainNameRule.prototype.isValidInvalid = function(password) {
        if (this.invalid.length === 0) {
            return true;
        }

        for (var i = 0; i < this.invalid.length; i++) {
            if (password.indexOf(this.invalid[i]) !== -1) {
                return false;
            }
        }

        return true;
    };

    /**
     * Determines if the password passes this rule's regular expression
     *
     * @param {string} password Password
     *
     * @returns {boolean} True if the password passes this rule's regular expression
     */
    DomainNameRule.prototype.isValidRegex = function(password) {
        if (this.regex) {
            var reg = this.getRegEx();

            if (!reg.test(password)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Determines if the password passes this rule's valid characters regular expression
     *
     * @param {string} password Password
     *
     * @returns {boolean} True if the password passes this rule's valid characters regular expression
     */
    DomainNameRule.prototype.isValidValidRegex = function(password) {
        if (this.validregex) {
            var reg = this.getValidRegEx();

            if (!reg.test(password)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Gets this rule's regular expression
     *
     * @returns {RegExp} Regular expression
     */
    DomainNameRule.prototype.getRegEx = function() {
        if (!this.regex) {
            return;
        }

        return new RegExp(this.regex);
    };

    /**
     * Gets this rule's regular expression
     *
     * @param {boolean} reverse If set, return an inverse of the regular expression
     *
     * @returns {RegExp} Regular expression
     */
    DomainNameRule.prototype.getValidRegEx = function(reverse) {
        if (!this.validregex) {
            return;
        }

        if (reverse) {
            return new RegExp("[^" + this.validregex + "]", "g");
        }

        return new RegExp("^[" + this.validregex + "]+$");
    };

    /**
     * Attemps to rewrite the password to match this domain's rules.
     *
     * @param {string} password Input password
     *
     * @returns {string|undefined} Rewritten password (if possible), or undefined it it could not be
     */
    DomainNameRule.prototype.rewrite = function(password) {
        // if it's already valid, return it
        if (this.isValid(password)) {
            return password;
        }

        var newPass = password;

        // remove invalid characters
        for (var i = 0; i < this.invalid.length; i++) {
            var index = -1;

            var invalidChar = this.invalid[i];

            while ((index = newPass.indexOf(invalidChar)) !== -1) {
                newPass = newPass.substr(0, index) + newPass.substr(index + 1);
            }
        }

        // if we have a valid characters regex, remove invalid characters from it
        if (this.validregex) {
            var reg = this.getValidRegEx();
            if (!reg.test(newPass)) {
                var nonRegEx = this.getValidRegEx(true);
                newPass = newPass.replace(nonRegEx, "");
            }
        }

        // trims, adds a required character if needed, then trims again.
        newPass = this.trimToMax(newPass);
        newPass = this.addRequiredChar(newPass);
        newPass = this.trimToMax(newPass);

        // make sure we're still valid
        if (!this.isValid(newPass)) {
            return;
        }

        return newPass;
    };

    /**
     * Trims a password to its maximum length for this rule
     *
     * @param {string} password Password
     *
     * @returns {string} Trimmed password
     */
    DomainNameRule.prototype.trimToMax = function(password) {
        var newPass = password;

        // trim to max
        if (newPass.length > this.max) {
            newPass = newPass.substr(0, this.max);
        }

        return newPass;
    };

    /**
     * Adds a required character to a password if needed.
     *
     * @param {string} password Password
     *
     * @returns {string} Password with at least one required character
     */
    DomainNameRule.prototype.addRequiredChar = function(password) {
        var newPass = password;

        if (this.required.length === 0) {
            return newPass;
        }

        // ensure there's at least one required character
        var foundMatch = false;
        for (var i = 0; i < this.required.length; i++) {
            if (newPass.indexOf(this.required[i]) !== -1) {
                foundMatch = true;
                break;
            }
        }

        if (this.required.length > 0 && !foundMatch) {
            // add the first required character
            var reqChar = this.required[0];

            // to the beginning of the string (since we trim the end)
            newPass = reqChar + newPass;
        }

        return newPass;
    };

    // export
    return DomainNameRule;
}));

/* eslint-env node,browser,amd */
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
(function(root, factory) {
    "use strict";

    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(
            [
                "saltthepass/domainnamerule",
                "saltthepass/utils",
                "crypto-js/md5",
                "crypto-js/sha1",
                "crypto-js/sha512",
                "crypto-js/sha3",
                "crypto-js/ripemd160",
                "crypto-js/enc-base64"
            ],
            factory);
    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.

        var modulePath = "";
        try {
            require("crypto-js/md5");
        } catch (e) {
            // If we're in Appcelerator's environment, they don't support
            // node_module loading, try to load it from our current path.
            modulePath = "../node_modules/";
        }

        module.exports = factory(
            require("./domainnamerule"),
            require("./utils"),
            require(modulePath + "crypto-js/md5"),
            require(modulePath + "crypto-js/sha1"),
            require(modulePath + "crypto-js/sha512"),
            require(modulePath + "crypto-js/sha3"),
            require(modulePath + "crypto-js/ripemd160"),
            require(modulePath + "crypto-js/enc-base64"));
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
}(this, function(DomainNameRule, utils, md5Fn, sha1Fn, sha512Fn, sha3Fn, ripemd160Fn, base64Fn) {
    "use strict";

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
        "md5": {
            length: 22,
            fn: md5Fn
        },
        "sha1": {
            length: 27,
            fn: sha1Fn
        },
        "sha2": {
            length: 86,
            fn: sha512Fn
        },
        "sha3": {
            length: 86,
            fn: sha3Fn
        },
        "ripemd160": {
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
     * @returns {string[]} List of hash names
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
     * @returns {function|undefined} Hash's hashing function
     */
    SaltThePass.getHashFn = function getHashFn(hashName) {
        if (!(hashName in HASHES)) {
            return undefined;
        }

        return HASHES[hashName].fn;
    };

    /**
     * Gets a hash's output length by its name.
     *
     * @param {string} hashName Hash name
     *
     * @returns {number} Hash output length, or 0 on error
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
     * @returns {string|undefined} Hashed phrase or undefined on error
     */
    SaltThePass.hash = function hash(hashName, phrase) {
        // we need to have been initialized first
        if (typeof phrase === "undefined" ||
            !phrase.length) {
            return;
        }

        // get the hash's hashing function
        var hashFn = this.getHashFn(hashName);
        if (typeof hashFn === "undefined") {
            return;
        }

        // hash and base-64 encode
        var hashedPhrase = hashFn(phrase);
        var base64 = hashedPhrase.toString(base64Fn);

        // remove trailing ==s from base64
        base64 = base64.replace(/\=+$/, "");

        //
        // NOTE: For base64, we use the base64url variation of RFC 4648 , which replaces the
        // last two characters of plus "+" and forward-slash "/" with minus "-" and underscore "_" to
        // produce Salted Passwords that are more likely to pass the password requirements of sites that
        // limit the characters that can be used in a password.  CryptoJS's Base64 doesn't do this, so we
        // patch the base64 output here.
        //
        base64 = base64.replace(/\+/g, "-");
        base64 = base64.replace(/\//g, "_");

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
     * @returns {string|undefined} Hashed phrase or undefined on error
     */
    SaltThePass.saltthepass = function saltthepass(hashName, masterPassword, domainName, domainPhrase) {
        // change any undefineds to ""s
        if (typeof masterPassword === "undefined") {
            masterPassword = "";
        }

        if (typeof domainName === "undefined") {
            domainName = "";
        }

        if (typeof domainPhrase === "undefined") {
            domainPhrase = "";
        }

        return this.hash(hashName, masterPassword + domainName + domainPhrase);
    };

    // export
    return SaltThePass;
}));
