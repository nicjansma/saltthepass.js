/*eslint-env node,mocha*/
/*global window*/
(function(root) {
    "use strict";

    //
    // Test Constants
    //
    var HASH_COUNT = 5;

    //
    // Run in either Mocha, Karma or Browser environments
    //
    if (typeof root === "undefined") {
        root = {};
    }

    var saltthepass = root.SaltThePass ? root.SaltThePass : require("../src/saltthepass");
    var expect = root.expect ? root.expect : require("expect.js");

    describe("SaltThePass", function() {
        //
        // getHashes
        //
        describe("getHashes()", function() {
            var hashes = saltthepass.getHashes();

            it("should know about HASH_COUNT hashes", function() {
                expect(hashes.length).to.eql(HASH_COUNT);
            });

            it("should return a list of functions", function() {
                for (var i = 0; i < hashes.length; i++) {
                    expect(saltthepass.getHashFn(hashes[i])).to.be.a("function");
                }
            });

            it("should be able to pass the functino to getHashLength", function() {
                for (var i = 0; i < hashes.length; i++) {
                    expect(saltthepass.getHashLength(hashes[i]) > 0).to.be.ok();
                }
            });
        });

        //
        // getHashFn
        //
        describe("getHashes()", function() {
            it("should return a function for md5", function() {
                expect(saltthepass.getHashFn("md5")).to.be.a("function");
            });

            it("should return a value when called for md5", function() {
                var md5Hasher = saltthepass.getHashFn("md5");
                expect(md5Hasher("foo").toString() !== "").to.be.ok();
            });

            it("should return undefined for an unknown hasher", function() {
                expect(saltthepass.getHashFn("DOES NOT EXIST")).to.be(undefined);
            });
        });

        //
        // getHashLength
        //
        describe("getHashLength()", function() {
            it("should return 22 for md5", function() {
                expect(saltthepass.getHashLength("md5")).to.eql(22);
            });

            it("should return 0 for an unknown hasher", function() {
                expect(saltthepass.getHashLength("DOES NOT EXIST")).to.eql(0);
            });
        });

        //
        // hash
        //
        describe("hash()", function() {
            it("should return undefined when given no args", function() {
                expect(saltthepass.hash()).to.be(undefined);
            });

            it("should return undefined when given a hasher that doesn't exist", function() {
                expect(saltthepass.hash("DOES NOT EXIST")).to.be(undefined);
            });

            it("should return undefined when given a hasher but no input", function() {
                expect(saltthepass.hash("md5", "")).to.be(undefined);
            });

            it("should return a known value for MD5", function() {
                expect(saltthepass.hash("md5", "testtest")).to.eql("BaZxxmrv6hJMwIt26m0wuw");
            });

            it("should return a known value for SHA1", function() {
                expect(saltthepass.hash("sha1", "testtest")).to.eql("Uau5Y2B43vv4iNhFenx2-FyPEUw");
            });

            it("should return a known value for SHA2", function() {
                expect(saltthepass.hash("sha2", "testtest"))
                    .to.eql("El1tA7MshNSSdH95zwv24XnSh_NBOE611tMZdSWta-jm3wEWAyk1aY-ZoJ4mUHPR1sMsJ0WRvx0KIK1ny6khvA");
            });

            it("should return a known value for SHA3", function() {
                expect(saltthepass.hash("sha3", "testtest"))
                    .to.eql("PABSS3GXmzC1ivdCEN7WsZoxsrr_q-ejnvDTWC2OQHIeZMCb8tcEla2v_32t5e4sxnReIB1mlHkGicKSNWfSYA");
            });

            it("should return a known value for RIPEMD160", function() {
                expect(saltthepass.hash("ripemd160", "testtest")).to.eql("ggC9BCXMcMfWmN8_5BIETqq4P5Q");
            });
        });

        //
        // saltthepass()
        //
        describe("saltthepass()", function() {
            it("should return undefined when given no args", function() {
                expect(saltthepass.saltthepass()).to.be(undefined);
            });

            it("should return undefined when given a hasher that doesn't exist", function() {
                expect(saltthepass.saltthepass("DOES NOT EXIST")).to.be(undefined);
            });

            it("should return undefined when given a hasher but no input", function() {
                expect(saltthepass.saltthepass("md5")).to.be(undefined);
            });

            it("should return a known value for MD5", function() {
                expect(saltthepass.saltthepass("md5", "test", "test")).to.eql("BaZxxmrv6hJMwIt26m0wuw");
                expect(saltthepass.saltthepass("md5", "test", "test", "")).to.eql("BaZxxmrv6hJMwIt26m0wuw");
            });
        });
    });
}(typeof window !== "undefined" ? window : undefined));
