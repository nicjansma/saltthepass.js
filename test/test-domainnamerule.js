/*eslint-env node,mocha*/
/*global window*/
(function(root) {
    "use strict";

    //
    // Run in either Mocha, Karma or Browser environments
    //
    if (typeof root === "undefined") {
        root = {};
    }

    var saltthepass = root.SaltThePass ? root.SaltThePass : require("../src/saltthepass");
    var expect = root.expect ? root.expect : require("expect.js");

    var DomainNameRule = saltthepass.DomainNameRule;

    describe("DomainNameRule", function() {
        //
        // .matches()
        //
        describe(".matches()", function() {
            var dnr = new DomainNameRule({
                domain: "foo.com",
                aliases: ["moo.com", "a.foo.com"]
            });

            //
            // Matches
            //

            it("should match the primary domain", function() {
                expect(dnr.matches("foo.com")).to.be.ok();
                expect(dnr.matches("http://foo.com")).to.be.ok();
                expect(dnr.matches("HTTP://foo.com")).to.be.ok();
                expect(dnr.matches("FOO.com")).to.be.ok();
                expect(dnr.matches("FOO.cOm")).to.be.ok();
            });

            it("should match aliases", function() {
                expect(dnr.matches("moo.com")).to.be.ok();
                expect(dnr.matches("HTTP://moo.com")).to.be.ok();
                expect(dnr.matches("moo.cOm")).to.be.ok();
            });

            it("should match subdomains", function() {
                expect(dnr.matches("a.foo.com")).to.be.ok();
                expect(dnr.matches("a.foo.com")).to.be.ok();
                expect(dnr.matches("a.foo.cOm")).to.be.ok();
            });

            it("should match paths", function() {
                expect(dnr.matches("foo.com/")).to.be.ok();
                expect(dnr.matches("foo.com/path")).to.be.ok();
            });

            //
            // Non-matches
            //

            it("should not match other similar domains", function() {
                expect(dnr.matches("oo.com")).to.not.be.ok();
                expect(dnr.matches("afoo.com")).to.not.be.ok();
            });

            // similar to other domains
            it("should not match other similar domains #2", function() {
                expect(dnr.matches("a.moo.com")).to.not.be.ok();
                expect(dnr.matches("http://afoo.com")).to.not.be.ok();
                expect(dnr.matches("b.foo.com")).to.not.be.ok();
            });
        });

        //
        // Constructor
        //
        describe("new DomainNameRule()", function() {
            it("should construct with the specified arguments", function() {
                // only requirement is domain
                var dnr = new DomainNameRule({
                    domain: "foo.com"
                });

                expect(dnr.domain).to.eql("foo.com");

                // test passing all
                dnr = new DomainNameRule({
                    domain: "foo.com",
                    min: 3,
                    max: 10,
                    required: ["a", "-"],
                    invalid: ["!"]
                });

                // validate
                expect(dnr.domain).to.eql("foo.com");
                expect(dnr.min).to.eql(3);
                expect(dnr.max).to.eql(10);
                expect(dnr.required).to.eql(["a", "-"]);
                expect(dnr.invalid).to.eql(["!"]);
            });
        });

        //
        // .isValid()
        //
        describe(".isValid()", function() {
            var dnr = new DomainNameRule({
                domain: "foo.com",
                min: 3,
                max: 10,
                required: ["a", "-"],
                invalid: ["!"]
            });

            // minimum / maximum - true
            it("should return true on valid passwords", function() {
                expect(dnr.isValid("aaa")).to.be.ok();
                expect(dnr.isValid("aaaa")).to.be.ok();
                expect(dnr.isValid("aaaaa")).to.be.ok();
                expect(dnr.isValid("aaaaaa")).to.be.ok();
                expect(dnr.isValid("aaaaaaa")).to.be.ok();
                expect(dnr.isValid("aaaaaaaa")).to.be.ok();
                expect(dnr.isValid("aaaaaaaaa")).to.be.ok();
                expect(dnr.isValid("aaaaaaaaaa")).to.be.ok();
            });

            it("should return false for passwords under the minimum length", function() {
                // under minimum - false
                expect(dnr.isValid("aa")).to.not.be.ok();
                expect(dnr.isValid("a")).to.not.be.ok();
                expect(dnr.isValid("")).to.not.be.ok();
            });

            // over maximum - false
            it("should return false for passwords over the maximum length", function() {
                expect(dnr.isValid("aaaaaaaaaaa")).to.not.be.ok();
                expect(dnr.isValid("aaaaaaaaaaaa")).to.not.be.ok();
            });

            // required characters
            it("should return true when required characters are specified", function() {
                expect(dnr.isValid("aaa")).to.be.ok();
            });

            // invalid characters
            it("should return false when an invalid character is specified", function() {
                expect(dnr.isValid("aaa!")).to.not.be.ok();
            });
        });

        describe(".isValid() using validregex", function() {
            var dnr = new DomainNameRule({
                domain: "foo.com",
                validregex: "A-Za-z0-9"
            });

            it("should return true for strings that match the regex", function() {
                expect(dnr.isValid("a")).to.be.ok();
                expect(dnr.isValid("A")).to.be.ok();
                expect(dnr.isValid("aa")).to.be.ok();
                expect(dnr.isValid("AA")).to.be.ok();
                expect(dnr.isValid("a9")).to.be.ok();
                expect(dnr.isValid("aA9")).to.be.ok();
                expect(dnr.isValid("aa01asd12e12d")).to.be.ok();
                expect(dnr.isValid("aA1z091AZfa")).to.be.ok();
            });

            it("should return false for strings that do not match the regex", function() {
                expect(dnr.isValid("a-")).to.not.be.ok();
                expect(dnr.isValid("a.")).to.not.be.ok();
                expect(dnr.isValid("a?")).to.not.be.ok();
                expect(dnr.isValid("-")).to.not.be.ok();
                expect(dnr.isValid("a-a")).to.not.be.ok();
            });
        });

        describe(".isValid() using a case-sensitive validregex", function() {
            var dnr = new DomainNameRule({
                domain: "foo.com",
                validregex: "A-Z0-9"
            });

            it("should return true for strings that match the regex", function() {
                expect(dnr.isValid("A")).to.be.ok();
                expect(dnr.isValid("AA")).to.be.ok();
            });

            it("should return false for strings that do not match the regex because of case issues", function() {
                expect(dnr.isValid("aA9")).to.not.be.ok();
                expect(dnr.isValid("aA1z091AZfa")).to.not.be.ok();
                expect(dnr.isValid("a")).to.not.be.ok();
                expect(dnr.isValid("aa")).to.not.be.ok();
                expect(dnr.isValid("a9")).to.not.be.ok();
                expect(dnr.isValid("aa01asd12e12d")).to.not.be.ok();
            });

            it("should return false for strings that do not match the regex", function() {
                expect(dnr.isValid("a-")).to.not.be.ok();
                expect(dnr.isValid("a.")).to.not.be.ok();
                expect(dnr.isValid("a?")).to.not.be.ok();
                expect(dnr.isValid("-")).to.not.be.ok();
                expect(dnr.isValid("a-a")).to.not.be.ok();
            });
        });

        describe(".isValid() - regex", function() {
            // this regex enforces at least one letter and one number
            var dnr = new DomainNameRule({
                domain: "foo.com",
                regex: "([A-Za-z])+([0-9])+|([0-9])+([A-Za-z])+"
            });

            it("should return true for strings that match the regex", function() {
                expect(dnr.isValid("1a")).to.be.ok();
                expect(dnr.isValid("a1")).to.be.ok();
                expect(dnr.isValid("1A")).to.be.ok();
                expect(dnr.isValid("A1")).to.be.ok();
                expect(dnr.isValid("1a1")).to.be.ok();
                expect(dnr.isValid("a1a")).to.be.ok();
                expect(dnr.isValid("aa01asd12e12d")).to.be.ok();
                expect(dnr.isValid("aA1z091AZfa-123123-21=312x-=321=3213-=s21=-3")).to.be.ok();
            });

            it("should return false for strings that do not match the regex", function() {
                expect(dnr.isValid("aa")).to.not.be.ok();
                expect(dnr.isValid("aA")).to.not.be.ok();
                expect(dnr.isValid("AAA")).to.not.be.ok();
                expect(dnr.isValid("1")).to.not.be.ok();
                expect(dnr.isValid("11122")).to.not.be.ok();
            });
        });

        //
        // .rewrite()
        //
        describe(".rewrite()", function() {
            var dnr = new DomainNameRule({
                domain: "foo.com",
                min: 3,
                max: 10,
                required: ["a", "-"],
                invalid: ["!"]
            });

            it("should not change the input if it doesn't need to be changed", function() {
                expect(dnr.rewrite("pass")).to.eql("pass");
            });

            it("should not change the input for 9 or 10 character strings", function() {
                expect(dnr.rewrite("aaaaaaaaa")).to.eql("aaaaaaaaa");
                expect(dnr.rewrite("aaaaaaaaaa")).to.eql("aaaaaaaaaa");
            });

            it("should trim to the max if over it", function() {
                expect(dnr.rewrite("aaaaaaaaaaaaaaaaaaaa")).to.eql("aaaaaaaaaa");
                expect(dnr.rewrite("aaaaaaaaaaa")).to.eql("aaaaaaaaaa");
            });

            it("should remove invalid characters", function() {
                expect(dnr.rewrite("pass!")).to.eql("pass");
                expect(dnr.rewrite("pass!!!!!!")).to.eql("pass");
                expect(dnr.rewrite("!!!!!pass!!!!!!")).to.eql("pass");
            });

            it("should remove all invalid characters even to the point that there are no characters left", function() {
                // invalid characters but won"t pass afterwards because not long enough
                expect(dnr.rewrite("!!!!!!!!!!!")).to.be(undefined);
            });

            it("should add required characters", function() {
                expect(dnr.rewrite("bb")).to.eql("abb");
                expect(dnr.rewrite("bbb")).to.eql("abbb");
                expect(dnr.rewrite("bbbb")).to.eql("abbbb");
            });

            it("should add required characters and trim the string if needed", function() {
                expect(dnr.rewrite("bbbbbbbbbbbbbbbbbb")).to.eql("abbbbbbbbb");
            });

            it("should not change it if at least one required character is present", function() {
                expect(dnr.rewrite("bbb-")).to.eql("bbb-");
            });

            it("should add a required character and trim if necessary", function() {
                expect(dnr.rewrite("bbbbbbbbbbbbbbbbbb-")).to.eql("abbbbbbbbb");
                expect(dnr.rewrite("bbbbbbbbbbbbbbbbbba")).to.eql("abbbbbbbbb");
                expect(dnr.rewrite("abbbbbbbbbbbbbbbbba")).to.eql("abbbbbbbbb");
                expect(dnr.rewrite("-bbbbbbbbbbbbbbbbbb")).to.eql("-bbbbbbbbb");
            });
        });

        describe(".rewrite() using validregex", function() {
            var dnr = new DomainNameRule({
                domain: "foo.com",
                validregex: "A-Za-z0-9"
            });

            it("should not change the input if it doesn't need to be changed", function() {
                expect(dnr.rewrite("pass")).to.eql("pass");
                expect(dnr.rewrite("PASS")).to.eql("PASS");
                expect(dnr.rewrite("PASS01")).to.eql("PASS01");
            });

            it("should remove invalid characters", function() {
                expect(dnr.rewrite("pass-pass")).to.eql("passpass");
                expect(dnr.rewrite("pass?-pass")).to.eql("passpass");
                expect(dnr.rewrite("pass?-PASS")).to.eql("passPASS");
            });
        });

        describe(".rewrite() using validregex with case sensitivity", function() {
            var dnr = new DomainNameRule({
                domain: "foo.com",
                validregex: "A-Z0-9"
            });

            it("should not change the input if it doesn't need to be changed", function() {
                expect(dnr.rewrite("PASS")).to.eql("PASS");
                expect(dnr.rewrite("PASS01")).to.eql("PASS01");
            });

            it("should remove invalid characters", function() {
                expect(dnr.rewrite("PaSS")).to.eql("PSS");
                expect(dnr.rewrite("PASS-PASS")).to.eql("PASSPASS");
                expect(dnr.rewrite("PASS?-PASS")).to.eql("PASSPASS");
                expect(dnr.rewrite("pass?-PASS")).to.eql("PASS");
            });
        });
    });
}(typeof window !== "undefined" ? window : undefined));
