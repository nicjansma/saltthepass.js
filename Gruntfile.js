module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n'
            },
            build: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [
                        'src/<%= pkg.name %>.js'
                    ],
                    'dist/<%= pkg.name %>.withcryptojs.min.js': [
                        'deps/crypto-js/core.js',
                        'deps/crypto-js/x64-core.js',
                        'deps/crypto-js/sha1.js',
                        'deps/crypto-js/sha512.js',
                        'deps/crypto-js/sha3.js',
                        'deps/crypto-js/md5.js',
                        'deps/crypto-js/ripemd160.js',
                        'deps/crypto-js/enc-base64.js',
                        'src/<%= pkg.name %>.js'
                    ]
                }
            }
        },
        jshint: {
            files: [ 'src/**/*.js', 'test/**/*.js' ],
            options: {
                bitwise: true, 
                camelcase: true, 
                curly: true, 
                eqeqeq: true, 
                forin: true, 
                immed: true,
                indent: 4, 
                latedef: true, 
                newcap: true, 
                noempty: true, 
                nonew: true, 
                quotmark: true, 
                jquery: true,
                undef: true, 
                unused: true, 
                strict: true, 
                trailing: true, 
                browser: true, 
                node: true, 
                white: false,
                globals: {
                    define: true,
                    window: true
                }
            }
        },
        nodeunit: {
            all: ['test/*.js']
        }
    });

    //
    // Plugins
    //
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //
    // Tasks
    //
    grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('test', ['nodeunit']);
    grunt.registerTask('lint', ['uglify']);
    grunt.registerTask('all', ['nodeunit', 'jshint', 'uglify']);
};