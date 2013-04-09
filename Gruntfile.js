module.exports = function (grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		config: {
			name: '<%= pkg.name %>',
			version: '<%= pkg.version %>',
			year: '<%= new Date().getFullYear() %>',
			author: '<%= pkg.author %>',
			license: '<%= pkg.license %>',
			homepage: '<%= pkg.homepage %>'
		},

		clean: {
			release: ["docs", "capture.min.js", "capture.js"]
		},

		docco: {
			debug: {
				src: ['capture.js'],
				options: {
					output: 'docs/',
					extension: 'md'
				}
			}
		},

		jshint: {
			all: ["Gruntfile.js", "src/capture.js", "test/{,*/}*.js"],
			options: {
				"node": true,
				"es5": true,
				"browser": true,
				"boss": false,
				"curly": false,
				"debug": false,
				"devel": false,
				"eqeqeq": true,
				"eqnull": true,
				"evil": false,
				"forin": false,
				"immed": false,
				"laxbreak": false,
				"newcap": true,
				"noarg": true,
				"noempty": false,
				"nonew": false,
				"onevar": false,
				"plusplus": false,
				"regexp": false,
				// switch to true once figuring out why
				// define is failing
				"undef": false,
				"sub": true,
				"strict": false,
				"white": true
			}
		},

		replace: {
			release: {
				options: {
					variables: {
						'name': '<%= config.name %>',
						'version': '<%= config.version %>',
						'year': '<%= config.date %>',
						'author': '<%= config.author %>',
						'license': '<%= config.license %>',
						'homepage': '<%= config.homepage %>'
					},
					flatten: true
				},
				files: [{
					src: ['src/capture.js'],
					dest: 'capture.js'
				}]
			}
		},

		nodeunit: {
			all: ["test/{,*/}*.js"]
		},

		uglify: {
			release: {
				options: {
					'banner': '/*!\n' + ' * <%= config.name %> <%= config.version %>\n' + ' * (c) <%= config.year %> <%= config.author %>\n' + ' * Capture may be freely distributed under the <%= config.license %> license.\n' + ' * For all details and documentation:\n' + ' * <%= config.homepage %>\n' + ' */\n'
				},

				files: {
					'capture.min.js': ['capture.js']
				}
			}
		}

	});

	// Test task.
	grunt.registerTask('test', ['jshint', 'nodeunit']);

	// Default task.
	grunt.registerTask('default', 'test');

	// Release task.
	grunt.registerTask('release', ['test', 'clean', 'replace', 'uglify', 'docco']);
};