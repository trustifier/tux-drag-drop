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
  gulp.src(['tux-drag-drop.html', 'bower.json', 'package.json'])
    .pipe(gulp.dest(TEST_DIR));

  gulp.src(['lib/**/*.js', 'lib/**/*.html'])
    .pipe(gulp.dest(path.join(TEST_DIR, 'lib')));
});

gulp.task('default', ['test'], function() {});
