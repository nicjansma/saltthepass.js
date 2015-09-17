/* eslint-env node,mocha */
/* global window */
(function(root) {
    "use strict";

    //
    // Run in either Mocha, Karma or Browser environments
    //
    if (typeof root === "undefined") {
        root = {};
    }

    var utils = root.SaltThePassUtils ? root.SaltThePassUtils : require("../src/utils");
    var expect = root.expect ? root.expect : require("expect.js");

    describe("SaltThePassUtils", function() {
        //
        // standardizeDomain
        //
        describe("standardizeDomain()", function() {
            it("should remove leading protocols", function() {
                expect(utils.standardizeDomain("http://foo.com")).to.eql("foo.com");
                expect(utils.standardizeDomain("HTTP://foo.com")).to.eql("foo.com");
            });

            it("should lowercase domains", function() {
                expect(utils.standardizeDomain("FOO.com")).to.eql("foo.com");
                expect(utils.standardizeDomain("FOO.COm")).to.eql("foo.com");
            });

            it("should remove trailing paths", function() {
                expect(utils.standardizeDomain("FOO.COm/")).to.eql("foo.com");
                expect(utils.standardizeDomain("https://FOO.COm/path?quest")).to.eql("foo.com");
            });
        });
    });
}(typeof window !== "undefined" ? window : undefined));
