var Stream = require('stream')
  , marked = require('marked')
  , gutil = require('gulp-util')
  , path = require('path')
  , BufferStreams = require('bufferstreams')
  , _ = require('lodash')
;

const PLUGIN_NAME = 'gulp-marked';

// File level transform function
function fileMarked(opt) {
  // Return a callback function handling the buffered content
  return function(err, buf, cb) {

    // Handle any error
    if(err) throw err;

    // Create a new Renderer object
    if (opt) {
      opt.renderer = _.extend(new marked.Renderer(), opt.renderer)
    }

    // Use the buffered content
    marked(String(buf), opt, function (err, content) {

      // Report any error with the callback
      if (err) {
        cb(new gutil.PluginError(PLUGIN_NAME, err, {showStack: true}));
      // Give the transformed buffer back
      } else {
        cb(null, content);
      }

    });

  };
}

// Plugin function
function gulpMarked(opt) {
  // Create a new Renderer object
  if (opt) {
    opt.renderer = _.extend(new marked.Renderer(), opt.renderer)
  }
  marked.setOptions(opt || {});

  var stream = Stream.Transform({objectMode: true});

  stream._transform = function(file, unused, done) {
     // Do nothing when null
    if(file.isNull()) {
      stream.push(file); done();
      return;
    }

    // If the ext doesn't match, pass it through
    if('.md' !== path.extname(file.path)) {
      stream.push(file); done();
      return;
    }

    file.path = gutil.replaceExtension(file.path, ".html");

    // Buffers
    if(file.isBuffer()) {
      marked(String(file.contents), function (err, content) {
        if(err) {
          stream.emit('error',
            new gutil.PluginError(PLUGIN_NAME, err, {showStack: true}));
          return done();
        }
        file.contents = Buffer(content);
        stream.push(file);
        done();
      });
    // Streams
    } else {
      file.contents = file.contents.pipe(new BufferStreams(fileMarked()));
      stream.push(file);
      done();
    }
  };

  return stream;

};

// Export the file level transform function for other plugins usage
gulpMarked.fileTransform = fileMarked;

// Export the plugin main function
module.exports = gulpMarked;

