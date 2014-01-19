'use strict';
/* globals describe, it */
var gulp = require('gulp'),
  expect = require('chai').expect,
  marked = require('../'),
  markedjs = require('marked'),
  es = require('event-stream'),
  Stream = require('stream'),
  fs = require('fs'),
  gutil = require('gulp-util'),
  path = require('path');

describe('gulp-marked markdown conversion', function() {

  describe('in buffer mode', function() {

    it('should convert my files', function(done) {
      var filename = path.join(__dirname, './fixtures/data.md');
      var markdown = fs.readFileSync(filename, { encoding: 'utf8' });

        gulp.src(filename, {buffer: true})
          .pipe(marked())
          .pipe(es.map(function(file) {
            expect(path.extname(file.path)).to.equal('.html');
            markedjs(markdown, function (err, content) {
              expect(String(file.contents)).to.equal(content);
              done();
            });
          }));

    });

    it('should let non-md files pass through', function(done) {

        var s = marked()
          , n = 0;
        s.pipe(es.through(function(file) {
            expect(file.path).to.equal('bibabelula.foo');
            expect(file.contents.toString('utf-8')).to.equal('ohyeah');
            n++;
          }, function() {
            expect(n).to.equal(1);
            done();
          }));
        s.write(new gutil.File({
          path: 'bibabelula.foo',
          contents: new Buffer('ohyeah')
        }));
        s.end();

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

    it('should let non-md files pass through', function(done) {

        var s = marked()
          , n = 0;
        s.pipe(es.through(function(file) {
            expect(file.path).to.equal('bibabelula.foo');
            expect(file.contents instanceof Stream.PassThrough);
            n++;
          }, function() {
            expect(n).to.equal(1);
            done();
          }));
        s.write(new gutil.File({
          path: 'bibabelula.foo',
          contents: new Stream.PassThrough()
        }));
        s.end();

    });

  });

});
