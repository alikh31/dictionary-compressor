/* jshint node: true */
'use strict'

const gulp = require('gulp')
const mocha = require('gulp-mocha')
const istanbul = require('gulp-istanbul')
const eslint = require('gulp-eslint')

gulp.task('pre-test', function() {
  return gulp.src(['api/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
})

gulp.task('cover', ['pre-test'], function() {
  return gulp.src('test/**/*{tests,test,Spec}.js', {
    read: false,
  })
  .pipe(mocha({reporter: 'base'}))
  .pipe(istanbul.writeReports())
})

gulp.task('lint', () => {
  return gulp.src(['api/**/*.js', 'test/api/**/*.js', '*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
})

gulp.task('test', function() {
  return gulp.src('test/**/*{tests,test,Spec}.js', {
    read: false,
  })
  .pipe(mocha({
    reporter: 'spec',
  }))
})

gulp.task('watch', function() {
  gulp.watch([
    '*.js',
    'test/**/*.{json,js}',
    'api/**/*.{js,json,yaml}',
  ], ['test'])
})

gulp.task('default', ['test', 'watch'])
