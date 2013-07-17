(function(exports) {
    'use strict';

    // load via src dir if in node, or regularly if via browser
    var saltthepass = require('../src/saltthepass');
    if (!saltthepass) {
        saltthepass = require('saltthepass');
    }

    var DomainNameRule = saltthepass.DomainNameRule;

    //
    // test group
    //
    var testcases = exports.DomainNameRule = {};

    //
    // .matches()
    //
    testcases['.matches()'] = function(test) {
        var dnr = new DomainNameRule({
            domain: 'foo.com',
            aliases: ['moo.com', 'a.foo.com']
        });

        //
        // Matches
        //

        // primary domain
        test.ok(dnr.matches('foo.com'));
        test.ok(dnr.matches('http://foo.com'));
        test.ok(dnr.matches('HTTP://foo.com'));
        test.ok(dnr.matches('FOO.com'));
        test.ok(dnr.matches('FOO.cOm'));

        // alias
        test.ok(dnr.matches('moo.com'));
        test.ok(dnr.matches('HTTP://moo.com'));
        test.ok(dnr.matches('moo.cOm'));

        // subdomain
        test.ok(dnr.matches('a.foo.com'));
        test.ok(dnr.matches('a.foo.com'));
        test.ok(dnr.matches('a.foo.cOm'));

        // path matches
        test.ok(dnr.matches('foo.com/'));
        test.ok(dnr.matches('foo.com/path'));

        //
        // Non-matches
        //

        // similar to main domain
        test.ok(!dnr.matches('oo.com'));
        test.ok(!dnr.matches('afoo.com'));

        // similar to other domains
        test.ok(!dnr.matches('a.moo.com'));
        test.ok(!dnr.matches('http://afoo.com'));
        test.ok(!dnr.matches('b.foo.com'));

        test.done();
    };

    //
    // Constructor
    //
    testcases['new DomainNameRule()'] = function(test) {
        // only requirement is domain
        var dnr = new DomainNameRule({
            domain: 'foo.com'
        });

        test.ok(dnr.domain === 'foo.com');

        // test passingin all
        dnr = new DomainNameRule({
            domain: 'foo.com',
            min: 3,
            max: 10,
            required: ['a', '-'],
            invalid: ['!']
        });

        test.done();
    };

    //
    // .isValid()
    //
    testcases['.isValid()'] = function(test) {
        var dnr = new DomainNameRule({
            domain: 'foo.com',
            min: 3,
            max: 10,
            required: ['a', '-'],
            invalid: ['!']
        });

        // minimum / maximum - true
        test.ok(dnr.isValid('aaa'));
        test.ok(dnr.isValid('aaaa'));
        test.ok(dnr.isValid('aaaaa'));
        test.ok(dnr.isValid('aaaaaa'));
        test.ok(dnr.isValid('aaaaaaa'));
        test.ok(dnr.isValid('aaaaaaaa'));
        test.ok(dnr.isValid('aaaaaaaaa'));
        test.ok(dnr.isValid('aaaaaaaaaa'));

        // under minimum - false
        test.ok(!dnr.isValid('aa'));
        test.ok(!dnr.isValid('a'));
        test.ok(!dnr.isValid(''));

        // over maximum - false
        test.ok(!dnr.isValid('aaaaaaaaaaa'));
        test.ok(!dnr.isValid('aaaaaaaaaaaa'));

        // required characters
        test.ok(dnr.isValid('aaa'));

        // invalid characters
        test.ok(!dnr.isValid('aaa!'));

        test.done();
    };

    testcases['.isValid() - validregex'] = function(test) {
        var dnr = new DomainNameRule({
            domain: 'foo.com',
            validregex: 'A-Z0-9'
        });

        // true
        test.ok(dnr.isValid('a'));
        test.ok(dnr.isValid('A'));
        test.ok(dnr.isValid('aa'));
        test.ok(dnr.isValid('AA'));
        test.ok(dnr.isValid('a9'));
        test.ok(dnr.isValid('aA9'));
        test.ok(dnr.isValid('aa01asd12e12d'));
        test.ok(dnr.isValid('aA1z091AZfa'));

        // not valid per regex
        test.ok(!dnr.isValid('a-'));
        test.ok(!dnr.isValid('a.'));
        test.ok(!dnr.isValid('a?'));
        test.ok(!dnr.isValid('-'));
        test.ok(!dnr.isValid('a-a'));

        test.done();
    };

    testcases['.isValid() - regex'] = function(test) {
        var dnr = new DomainNameRule({
            domain: 'foo.com',
            regex: '([A-Za-z])+([0-9])+|([0-9])+([A-Za-z])+'
        });

        // this regex enforces at least one letter and one number

        // true
        test.ok(dnr.isValid('1a'));
        test.ok(dnr.isValid('a1'));
        test.ok(dnr.isValid('1A'));
        test.ok(dnr.isValid('A1'));
        test.ok(dnr.isValid('1a1'));
        test.ok(dnr.isValid('a1a'));
        test.ok(dnr.isValid('aa01asd12e12d'));
        test.ok(dnr.isValid('aA1z091AZfa-123123-21=312x-=321=3213-=s21=-3'));

        // does not pass regex
        test.ok(!dnr.isValid('aa'));
        test.ok(!dnr.isValid('aA'));
        test.ok(!dnr.isValid('AAA'));
        test.ok(!dnr.isValid('1'));
        test.ok(!dnr.isValid('11122'));

        test.done();
    };

    //
    // .rewrite()
    //
    testcases['.rewrite()'] = function(test) {
        var dnr = new DomainNameRule({
            domain: 'foo.com',
            min: 3,
            max: 10,
            required: ['a', '-'],
            invalid: ['!']
        });

        // no change - good
        test.equal('pass', dnr.rewrite('pass'));

        // no change - 9 and 10 chars
        test.equal('aaaaaaaaa', dnr.rewrite('aaaaaaaaa'));
        test.equal('aaaaaaaaaa', dnr.rewrite('aaaaaaaaaa'));

        // trim to a maximum
        test.equal('aaaaaaaaaa', dnr.rewrite('aaaaaaaaaaaaaaaaaaaa'));
        test.equal('aaaaaaaaaa', dnr.rewrite('aaaaaaaaaaa'));

        // remove invalid characters
        test.equal('pass', dnr.rewrite('pass!'));
        test.equal('pass', dnr.rewrite('pass!!!!!!'));
        test.equal('pass', dnr.rewrite('!!!!!pass!!!!!!'));

        // invalid characters but won't pass afterwards because not long enough
        test.equal(undefined, dnr.rewrite('!!!!!!!!!!!'));

        // adds required chars
        test.equal('abb', dnr.rewrite('bb'));
        test.equal('abbb', dnr.rewrite('bbb'));
        test.equal('abbbb', dnr.rewrite('bbbb'));

        // adds a required character but needs to trim the string
        test.equal('abbbbbbbbb', dnr.rewrite('bbbbbbbbbbbbbbbbbb'));

        // has a required char
        test.equal('bbb-', dnr.rewrite('bbb-'));

        // has a required char and will be trimmed
        test.equal('abbbbbbbbb', dnr.rewrite('bbbbbbbbbbbbbbbbbb-'));
        test.equal('abbbbbbbbb', dnr.rewrite('bbbbbbbbbbbbbbbbbba'));
        test.equal('abbbbbbbbb', dnr.rewrite('abbbbbbbbbbbbbbbbba'));
        test.equal('-bbbbbbbbb', dnr.rewrite('-bbbbbbbbbbbbbbbbbb'));

        test.done();
    };

    testcases['.rewrite() - validregex'] = function(test) {
        var dnr = new DomainNameRule({
            domain: 'foo.com',
            validregex: 'A-Z0-9'
        });

        // no change - good
        test.equal('pass', dnr.rewrite('pass'));
        test.equal('PASS', dnr.rewrite('PASS'));
        test.equal('PASS01', dnr.rewrite('PASS01'));

        // remove invalid chars
        test.equal('passpass', dnr.rewrite('pass-pass'));
        test.equal('passpass', dnr.rewrite('pass?-pass'));
        test.equal('passPASS', dnr.rewrite('pass?-PASS'));

        test.done();
    };
})(exports);