/*!
  Copyright 2014 LinkedIn Corp. All rights reserved. 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
module.exports = function (grunt) {
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        force: true,
        laxbreak: true,
        quotmark: 'single'
      },
      files: ['dev/*.js']
    },

    venus: {
      tests: [
        'test/spec/slacker.spec.js'
      ]
    },

    replace: {
      dev: {
        options: {
          variables: {
            'opencomment': '',
            'closecomment': ''
          }
        },
        files: [
          {expand: true, flatten: true, src: ['src/slacker.js'], dest: 'dev/'}
        ]
      },
      prod: {
        options: {
          variables: {
            'opencomment': '/*',
            'closecomment': '*/'
          }
        },
        files: [
          {expand: true, flatten: true, src: ['src/slacker.js'], dest: 'dist/'}
        ]
      }
    },

    concat: {
      options: {
        stripBanners: true
      },
      prod: {
        options: {
          banner: '/*!' + "\n" +
                  '  <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>' + "\n" +
                  '  <%= pkg.description %>' + "\n" +
                  '*/' + "\n"              
        },
        files: {
          'dist/slacker.js': ['dist/slacker.js'],
          'demo/js/slacker.js': ['dist/slacker.js']
        }
      },
      dev: {
        files: {
          'demo/js/slacker.js': ['dev/slacker.js']
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/slacker.min.js': ['dist/slacker.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-venus');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('dev',  ['replace:dev', 'jshint', 'venus', 'concat:dev'           ]);
  grunt.registerTask('prod', ['replace:prod',                   'concat:prod', 'uglify']);
};