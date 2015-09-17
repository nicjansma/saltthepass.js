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
