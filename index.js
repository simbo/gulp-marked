var Stream = require('stream')
  , marked = require('marked')
  , gutil = require('gulp-util')
  , BufferStreams = require('bufferstreams')
;

const PLUGIN_NAME = 'gulp-marked';

// File level transform function
function fileMarked(opt) {
  // Return a callback function handling the buffered content
  return function(err, buf, cb) {

    // Handle any error
    if(err) throw err;

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

  marked.setOptions(opt || {});

  var stream = Stream.Transform({objectMode: true});
  
  stream._transform = function(file, unused, done) {
     // Do nothing when null
    if(file.isNull()) {
      this.push(file); done();
      return;
    }

    // Buffers
    if(file.isBuffer()) {
      marked(String(file.contents), function (err, content) {
        if(err) {
          stream.emit('error',
            new gutil.PluginError(PLUGIN_NAME, err, {showStack: true}));
          return done();
        }
        file.contents = Buffer(content);
      });
    // Streams
    } else {
      file.contents = file.contents.pipe(new BufferStreams(fileMarked()));
    }
    this.push(file);
    done();
  };

  return stream;

};

// Export the file level transform function for other plugins usage
gulpMarked.fileTransform = fileMarked;

// Export the plugin main function
module.exports = gulpMarked;

