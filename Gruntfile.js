
module.exports = function (grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		docco: {
			debug: {
				src: ['src/capture.js'],
				options: {
					output: 'docs/'
				}	
			}
		},

		jshint: {
			all: ["Gruntfile.js", "src/capture.js", "test/*.js"],
			options: {
				"node"     : true,
                "es5"      : true,
                "browser"  : true,
                "boss"     : false,
                "curly"    : true,
                "debug"    : false,
                "devel"    : false,
                "eqeqeq"   : true,
                "eqnull"   : true,
                "evil"     : false,
                "forin"    : false,
                "immed"    : false,
                "laxbreak" : false,
                "newcap"   : true,
                "noarg"    : true,
                "noempty"  : false,
                "nonew"    : false,
                "onevar"   : true,
                "plusplus" : false,
                "regexp"   : false,
                // switch to true once figuring out why
                // define is failing
                "undef"    : false,
                "sub"      : true,
                "strict"   : false,
                "white"    : true	
			}
		},

		nodeunit: {
			all: ["test/*.js"]
		}

	});
	
	// Default task.
	grunt.registerTask('default', ['jshint', 'nodeunit']);

	// Release task.
	grunt.registerTask('release', 'docco');
};