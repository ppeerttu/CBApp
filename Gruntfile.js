/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        uglify: {
            build: {
                src: ['public/app/app.js', 'public/app/controllers/*.js', 'public/app/services/*.js'],
                dest: 'public/app/app.min.js'
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPercision: -1
            },
            target: {
                files: {
                    'public/app/styles/css.min.css': ['public/app/styles/**.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify', 'cssmin']);
};
