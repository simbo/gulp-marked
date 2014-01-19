'use strict';
/* globals describe, it */
var gulp = require('gulp'),
  expect = require('chai').expect,
  marked = require('../'),
  markedjs = require('marked'),
  es = require('event-stream'),
  fs = require('fs'),
  path = require('path');

describe('gulp-marked markdown conversion', function() {

  describe('in buffer mode', function() {

    it('should convert my files', function(done) {
      var filename = path.join(__dirname, './fixtures/data.md');
      var markdown = fs.readFileSync(filename, { encoding: 'utf8' });

        gulp.src(filename)
          .pipe(marked())
          .pipe(es.map(function(file) {
            expect(path.extname(file.path)).to.equal('.html');
            markedjs(markdown, function (err, content) {
              expect(String(file.contents)).to.equal(content);
              done();
            });
          }));

    });

  });

});


describe('gulp-marked markdown conversion', function() {

  describe('in stream mode', function() {

    it('should convert my files', function(done) {
      var filename = path.join(__dirname, './fixtures/data.md');
      var markdown = fs.readFileSync(filename, { encoding: 'utf8' });

        gulp.src(filename, {buffer: false})
          .pipe(marked())
          .pipe(es.map(function(file) {
            expect(path.extname(file.path)).to.equal('.html');
            // Get the buffer to compare results
            file.contents.pipe(es.wait(function(err, data) {
              markedjs(markdown, function (err, content) {
                expect(data).to.equal(content);
                done();
              });
            }));
          }));

    });

  });

});
