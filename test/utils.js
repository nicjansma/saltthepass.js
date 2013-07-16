(function(exports) {
    'use strict';

    //
    // Imports
    //
    // load via src dir if in node, or regularly if via browser
    var saltthepass = require('../src/saltthepass');
    if (!saltthepass) {
        saltthepass = require('saltthepass');
    }

    //
    // test group
    //
    var testcases = exports.SaltThePassUtils = {};

    //
    // standardizeDomain
    //
    testcases['.standardizeDomain()'] = function(test) {
        test.equals('foo.com', saltthepass.standardizeDomain('http://foo.com'));
        test.equals('foo.com', saltthepass.standardizeDomain('HTTP://foo.com'));
        test.equals('foo.com', saltthepass.standardizeDomain('FOO.com'));
        test.equals('foo.com', saltthepass.standardizeDomain('FOO.COm'));
        test.equals('foo.com', saltthepass.standardizeDomain('FOO.COm/'));
        test.equals('foo.com', saltthepass.standardizeDomain('https://FOO.COm/path?quest'));
        test.done();
    };
})(exports);