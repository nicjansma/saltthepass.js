#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console, no-implicit-globals */
//
// Imports
//
var yargs = require("yargs");
var SaltThePass = require("./src/saltthepass");
var hashes = SaltThePass.getHashes();

//
// Command-line args
//
var argv = yargs
    .option("hash", {
        alias: "h",
        desc: "Name of the hash, e.g. md5",
        default: "md5",
        choices: hashes,
        requiresArg: true
    })
    .option("password", {
        alias: "p",
        desc: "Master Password",
        demandOption: true,
        requiresArg: true
    })
    .option("domain", {
        alias: "d",
        desc: "Domain Name",
        demandOption: true,
        requiresArg: true
    })
    .option("phrase", {
        alias: "r",
        desc: "Domain phrase",
        requiresArg: true
    })
    .help()
    .strict()
    .version()
    .argv;

console.log(SaltThePass.saltthepass(argv.hash, argv.password, argv.domain, argv.phrase));
