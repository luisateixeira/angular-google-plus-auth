module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			jshintrc: '.jshintrc',
			app: ['src/<%= pkg.name %>.js', 'example/*.js'],
			gruntfile: ['Gruntfile.js']
		},

		clean: {
			build: ['dist/*', 'example/dist/*'],
			tmp: ['tmp']
		},

		useminPrepare: {
			html: 'example/index.html',
			options: {
				dest: 'example/dist/'
			}
		},

		usemin: {
			html: ['example/dist/index.html'],
			css: ['example/dist/*.css'],
			js: ['example/dist/*.js'],
			options: {
				dirs: ['example/dist']
			}
		},

		concat: {
			example: {
				files: [{
					dest: 'tmp/concat/js/example.js',
					src: [
						'bower_components/angular/angular.min.js',
						'dist/angular-google-plus-auth.js',
						'example/app.js',
						'example/boot.js'
					]
				}]
			}
		},

		copy: {
			example: {
				files: [{
					expand: true,
					cwd: 'example/',
					src: ['index.html', 'main.css',
						'login.html'
					],
					dest: 'example/dist/'
				}]
			}
		},

		uglify: {
			dist: {
				options: {
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> ' +
						'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
					'dist/<%= pkg.name %>.min.js': [
						'src/<%= pkg.name %>.js'
					]
				}
			},

			src: {
				options: {
					beautify: true,
					compress: false,
					mangle: false,
					preserveComments: 'all',
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> ' +
						'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: {
					'dist/<%= pkg.name %>.js': [
						'src/<%= pkg.name %>.js'
					]
				}
			},

			example: {
				files: {
					'example/dist/example.min.js': [
						'tmp/concat/js/example.js'
					]
				}
			}
		},

		connect: {
			options: {
				port: 3000,
				keepalive: true
			},

			exampleSrc: {
				options: {
					open: true,
					middleware: function (connect) {
						return [
							connect().use(
								'/bower_components',
								connect.static(
									'./bower_components')
							),
							connect().use(
								'/dist',
								connect.static('./dist')
							),
							connect.static('example')
						];
					},
					base: 'example'
				}
			},

			exampleDist: {
				options: {
					open: true,
					base: 'example/dist'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-usemin');

	grunt.registerTask('publish', [
		'clean',
		'jshint',
		'uglify:dist',
		'uglify:src'
	]);

	grunt.registerTask('example:dist', [
		'publish',
		'useminPrepare',
		'concat:example',
		'uglify:example',
		'copy:example',
		'usemin',
		'clean:tmp',
		'connect:exampleDist'
	]);

	grunt.registerTask('example', [
		'publish',
		'connect:exampleSrc'
	]);

};
