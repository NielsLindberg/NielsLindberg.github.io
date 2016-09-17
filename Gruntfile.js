module.exports = function(grunt) {

    grunt.initConfig({
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{jpeg,png,jpg,gif}'],
                    dest: 'dist/'
                }]
            }
        },
        less: {
            lesserisbesser: {
                files: [{
                    'src/css/style.css': 'src/css/style.less'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.css'],
                    dest: 'dist/',
                    ext: '.css'
                }]
            }
        },
        responsive_images: {
            create_images: {
                options: {
                    engine: 'im',
                    quality: 100,
                    newFilesOnly: false,
                    rename: false,
                    autoOrient: true,
                    sizes: [
                        { width: 150 }
                    ]
                },
                files: [{}]
            }
        },
        uglify: {
            options: {
                preserveComments: false
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: '**/*.js',
                    dest: 'dist/'
                }]
            }
        },
        htmlmin: {
            target: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.html'],
                    dest: 'dist/',
                    ext: '.html'
                }]
            }
        },
        embed: {
            options: {
                threshold: '5KB'
            },
            html1: {
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            },
            html2: {
                files: {}
            },
            html3: {
                files: {}
            },
            html4: {
                files: {}
            },
            html5: {
                files: {}
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-embed');
    grunt.registerTask('default', ['imagemin', 'responsive_images','less', 'cssmin', 'uglify', 'htmlmin', 'embed']);
};
