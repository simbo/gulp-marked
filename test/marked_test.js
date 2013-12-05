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

  describe('gulp-marked', function() {
    it('should convert my files', function(done) {
      var filename = path.join(__dirname, './fixtures/data.md');
      var markdown = fs.readFileSync(filename, { encoding: 'utf8' });

        gulp.src(filename)
          .pipe(marked())
          .pipe(es.map(function(file) {
            markedjs(markdown, function (err, content) {
              expect(String(file.contents)).to.equal(content);
              done();
            });
          }));

    });
  });
});