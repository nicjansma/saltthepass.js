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
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./utils'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('./utils'));
    } else {
        // Browser globals (root is window)
        root.DomainNameRule = factory(root.SaltThePassUtils);
    }
}(this, function (utils) {
    'use strict';

    //
    // Constructor
    //
    /**
     * Creates a new DomainNameRule
     *
     * @param {object} data Parameters
     *
     * @returns {DomainNameRule} Domain Name Rule
     */
    function DomainNameRule(data) {
        if (typeof (data) === 'undefined') {
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
        this.min = (typeof(data.min) !== 'undefined') ? (parseInt(data.min, 10) || 0) : 0;
        this.max = (typeof(data.max) !== 'undefined') ? (parseInt(data.max, 10) || Number.MAX_VALUE) : Number.MAX_VALUE;
        this.invalid = (typeof(data.invalid) !== 'undefined') ? data.invalid : '';
        this.required = (typeof(data.required) !== 'undefined') ? data.required : '';

        this.regex = data.regex;
    }

    /**
     * Determines if the domain has a minimum number of characters
     *
     * @returns {boolean}
     */
    DomainNameRule.prototype.hasMin = function() {
        return this.min !== 0;
    };

    /**
     * Determines if the domain has a maximum number of characters
     *
     * @returns {boolean}
     */
    DomainNameRule.prototype.hasMax = function() {
        return this.max !== Number.MAX_VALUE;
    };

    /**
     * Determines if the domain has specific required characters
     *
     * @returns {boolean}
     */
    DomainNameRule.prototype.hasRequired = function() {
        return this.required.length !== 0;
    };

    /**
     * Determines if the domain has a list of invalid characters
     *
     * @returns {boolean}
     */
    DomainNameRule.prototype.hasInvalid = function() {
        return this.invalid.length !== 0;
    };

    /**
     * Determines if the domain has a regular expression that must match
     *
     * @returns {boolean}
     */
    DomainNameRule.prototype.hasRegex = function() {
        return typeof(this.regex) !== 'undefined';
    };

    /**
     * Determines if the specified domain matches this rule's domain
     * or one of its aliases.
     *
     * @param {string} domain Domain to check
     *
     * @return {boolean} True if the domain matches
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
     * @return {boolean} True if the password matches the domain's rules
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

        return true;
    };

    /**
     * Determines if the password passes this rule's minimum number of characters
     *
     * @returns {boolean}
     */
    DomainNameRule.prototype.isValidMin = function(password) {
        return (password.length >= this.min);
    };

    /**
     * Determines if the password passes this rule's maximum number of characters
     *
     * @returns {boolean}
     */
    DomainNameRule.prototype.isValidMax = function(password) {
        return (password.length <= this.max);
    };

    /**
     * Determines if the password passes this rule's required characters
     *
     * @returns {boolean}
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
     * @returns {boolean}
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
     * @returns {boolean}
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
     * Gets this rule's regular expression
     *
     * @param {boolean} reverse If set, return an inverse of the regular expression
     *
     * @returns {RegExp} Regular expression
     */
    DomainNameRule.prototype.getRegEx = function(reverse) {
        if (!this.regex) {
            return;
        }

        if (reverse) {
            return new RegExp('[^' + this.regex + ']', 'gi');
        } else {
            return new RegExp('^[' + this.regex + ']+$', 'i');
        }
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

        // if we have a regex, remove invalid characters from it
        if (this.regex) {
            var reg = this.getRegEx();
            if (!reg.test(newPass)) {
                var nonRegEx = this.getRegEx(true);
                newPass = newPass.replace(nonRegEx, '');
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
