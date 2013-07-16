(function(exports) {
    'use strict';

    //
    // Test Constants
    //
    var HASH_COUNT = 5;

    // load via src dir if in node, or regularly if via browser
    var saltthepass = require('../src/saltthepass');
    if (!saltthepass) {
        saltthepass = require('saltthepass');
    }

    //
    // test group
    //
    var testcases = exports.SaltThePass = {};

    //
    // getHashes
    //
    testcases['getHashes()'] = function(test) {
        var hashes = saltthepass.getHashes();

        test.equal(HASH_COUNT, hashes.length);

        test.done();
    };

    testcases['getHashes() - hash lengths and functions exist'] = function(test) {
        var hashes = saltthepass.getHashes();

        for (var i = 0; i < hashes.length; i++) {
            test.equal('function', typeof(saltthepass.getHashFn(hashes[i])));
            test.ok(saltthepass.getHashLength(hashes[i]) > 0);
        }

        test.done();
    };

    //
    // getHashFn
    //
    testcases['getHashFn() - existence'] = function(test) {
        test.equal('function', typeof(saltthepass.getHashFn('md5')));
        test.done();
    };

    testcases['getHashFn() - call'] = function(test) {
        var md5Hasher = saltthepass.getHashFn('md5');
        test.ok(md5Hasher('foo').toString() !== '');
        test.done();
    };

    testcases['getHashFn() - missing'] = function(test) {
        test.equal('undefined', typeof(saltthepass.getHashFn('DOES NOT EXIST')));
        test.done();
    };

    //
    // getHashLength
    //
    testcases['getHashLength()'] = function(test) {
        test.equal(22, saltthepass.getHashLength('md5'));
        test.done();
    };

    testcases['getHashLength() - missing'] = function(test) {
        test.equal(0, saltthepass.getHashLength('DOES NOT EXIST'));
        test.done();
    };

    //
    // hash
    //
    testcases['hash() - error cases'] = function(test) {
        test.equal(undefined, saltthepass.hash());
        test.equal(undefined, saltthepass.hash('DOES NOT EXIST'));
        test.equal(undefined, saltthepass.hash('md5', ''));
        test.done();
    };

    // test against known values
    testcases['hash() - md5 known values'] = function(test) {
        test.equal('BaZxxmrv6hJMwIt26m0wuw', saltthepass.hash('md5', 'testtest'));
        test.done();
    };

    testcases['hash() - sha1 known values'] = function(test) {
        test.equal('Uau5Y2B43vv4iNhFenx2-FyPEUw', saltthepass.hash('sha1', 'testtest'));
        test.done();
    };

    testcases['hash() - sha2 known values'] = function(test) {
        test.equal(
            'El1tA7MshNSSdH95zwv24XnSh_NBOE611tMZdSWta-jm3wEWAyk1aY-ZoJ4mUHPR1sMsJ0WRvx0KIK1ny6khvA',
            saltthepass.hash('sha2', 'testtest'));
        test.done();
    };

    testcases['hash() - sha3 known values'] = function(test) {
        test.equal(
            'PABSS3GXmzC1ivdCEN7WsZoxsrr_q-ejnvDTWC2OQHIeZMCb8tcEla2v_32t5e4sxnReIB1mlHkGicKSNWfSYA',
            saltthepass.hash('sha3', 'testtest'));
        test.done();
    };

    testcases['hash() - ripemd64 known values'] = function(test) {
        test.equal('ggC9BCXMcMfWmN8_5BIETqq4P5Q', saltthepass.hash('ripemd160', 'testtest'));
        test.done();
    };

    //
    // saltthepass
    //
    testcases['saltthepass() - error cases'] = function(test) {
        test.equal(undefined, saltthepass.saltthepass());
        test.equal(undefined, saltthepass.saltthepass('DOES NOT EXIST'));
        test.equal(undefined, saltthepass.saltthepass('md5'));
        test.done();
    };

    // test against known values
    testcases['saltthepass() - known values'] = function(test) {
        test.equal('BaZxxmrv6hJMwIt26m0wuw', saltthepass.saltthepass('md5', 'test', 'test'));
        test.equal('BaZxxmrv6hJMwIt26m0wuw', saltthepass.saltthepass('md5', 'test', 'test', ''));
        test.done();
    };
})(exports);