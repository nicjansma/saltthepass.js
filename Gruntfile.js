/* eslint-env node */
module.exports = function(grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            options: {},
            build: ["test/*.tap", "test/coverage"]
        },
        concat: {
            options: {
                stripBanners: false,
                seperator: ";"
            },
            dist: {
                src: [
                    "src/utils.js",
                    "src/domainnamerule.js",
                    "src/saltthepass.js"
                ],
                dest: "dist/<%= pkg.name %>.js"
            },
            "dist-withdeps": {
                src: [
                    "bower_components/cryptojslib/components/core.js",
                    "bower_components/cryptojslib/components/x64-core.js",
                    "bower_components/cryptojslib/components/sha1.js",
                    "bower_components/cryptojslib/components/sha512.js",
                    "bower_components/cryptojslib/components/sha3.js",
                    "bower_components/cryptojslib/components/md5.js",
                    "bower_components/cryptojslib/components/ripemd160.js",
                    "bower_components/cryptojslib/components/enc-base64.js",
                    "src/utils.js",
                    "src/domainnamerule.js",
                    "src/saltthepass.js"
                ],
                dest: "dist/<%= pkg.name %>.withdeps.js"
            }
        },
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> v<%= pkg.version %> */\n",
                mangle: true,
                sourceMap: true
            },
            build: {
                files: {
                    "dist/<%= pkg.name %>.min.js": ["dist/<%= pkg.name %>.js"],
                    "dist/<%= pkg.name %>.withdeps.min.js": ["dist/<%= pkg.name %>.withdeps.js"]
                }
            }
        },
        eslint: {
            console: {
                src: [
                    "Gruntfile.js",
                    "src/**/*.js",
                    "test/*.js"
                ]
            },
            build: {
                options: {
                    "output-file": "eslint.xml",
                    "format": "jslint-xml",
                    "silent": true
                },
                src: [
                    "Gruntfile.js",
                    "src/**/*.js",
                    "test/*.js"
                ]
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "tap",
                    captureFile: "test/mocha.tap"
                },
                src: [
                    "src/saltthepass.js",
                    "test/*.js"
                ]
            }
        },
        karma: {
            options: {
                singleRun: true,
                colors: true,
                configFile: "./karma.config.js",
                preprocessors: {
                    "dist/saltthepass.withdeps.js": ["coverage"]
                },
                basePath: "./",
                files: [
                    "bower_components/mocha/mocha.css",
                    "bower_components/mocha/mocha.js",
                    "bower_components/expect/index.js",
                    "dist/saltthepass.withdeps.js",
                    "test/test-*.js"
                ]
            },
            console: {
                browsers: ["PhantomJS"],
                frameworks: ["mocha"]
            }
        }
    });

    //
    // Plugins
    //
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("gruntify-eslint");

    //
    // Tasks
    //
    grunt.registerTask("test", ["mochaTest", "karma:console"]);

    grunt.registerTask("lint", ["eslint:console"]);
    grunt.registerTask("lint:build", ["eslint:build"]);

    grunt.registerTask("build", ["concat", "uglify"]);

    //
    // Task Groups
    //
    grunt.registerTask("default", ["lint", "build"]);
    grunt.registerTask("travis", ["clean", "lint", "build", "test"]);
    grunt.registerTask("all", ["clean", "lint:console", "build", "test"]);
};
