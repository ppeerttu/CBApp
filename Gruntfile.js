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
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.registerTask('default', ['uglify']);
};