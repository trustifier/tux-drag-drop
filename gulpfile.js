var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var fs = require('fs');
var del = require('del');
var git = require('gulp-git');
var pkg = require(path.join(__dirname, 'package.json'));
var TEST_DIR=path.join(__dirname, 'bower_components/' + pkg.name);
var DIST_DIR=path.join(__dirname, 'dist');

gulp.task('clean', function() {
  del([TEST_DIR, DIST_DIR])
    .then(function(paths){
      console.log('Deleted:\n\t', paths.join('\n\t'));
    });
});

gulp.task('maintainer-clean', [ 'clean' ],  function() {
  
});

gulp.task('test', function() {
  var bower_relative_path = path.relative(
    TEST_DIR,
    path.join(__dirname, 'bower_components/')
  );

  gulp.src(['*.html', 'lib/**/*.js', 'lib/**/*.html'])
    .pipe($.replace('../bower_components', bower_relative_path))
    .pipe($.if('tux-drag-drop.html', gulp.dest(TEST_DIR), gulp.dest(path.join(TEST_DIR, 'lib'))))
    .pipe($.size({title: 'tux-drag-drop'}));
});

gulp.task('default', ['test'], function() {});
