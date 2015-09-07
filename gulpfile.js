var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var fs = require('fs');
var del = require('del');
var Promise = require('bluebird');
var stream = require('stream');
var source = require('vinyl-source-stream');
var pkg = require(path.join(__dirname, 'package.json'));
var bwr = require(path.join(__dirname, 'bower.json'));
var TEST_DIR=path.join(__dirname, 'bower_components/' + pkg.name);
var DIST_DIR=path.join(__dirname, 'dist');


gulp.task('clean', function() {
  del([TEST_DIR, DIST_DIR])
    .then(function(paths){
      console.log('Deleted:\n\t', paths.join('\n\t'));
    });
});

function saveBranch() {
  return Promise.try(function(){
    $.git.stash(function(err) {
      if (err) throw  err;
      return true;
    });
  });
}

function restoreBranch(branch) {
  return new Promise.try($.git.stash({ args: 'pop' }))
}

gulp.task('stash', saveBranch);

function inc(importance) {
  return Promise.try(function() {
    $.git.checkout('releases', function(err) {
      if(err) throw err;
    });
    return gulp.src(['./package.json', './bower.json'])
    .pipe($.bump({ type: importance }))
    .pipe(gulp.dest('./'))
    .pipe($.filter('package.json'))
  });
}

gulp.task('gh:rel',  function() {
  var branch = saveBranch();
  branch
    .then(inc('patch'))
    .then(new Promise(function(resolve, reject) {
      $.git.exec({ args: 'push --all' }, function(err, result) {
        if(err) reject(err);
        resolve(result);
      });
    }))
    .then(restoreBranch(branch));
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
