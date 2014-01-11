var es = require('event-stream');
var marked = require('marked');
var BufferStreams = require('bufferstreams');

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
        cb(err);
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

  return es.map(function (file, callback) {
    // Buffers
    if(file.isBuffer()) {
      marked(String(file.contents), function (err, content) {
        if (!err) file.contents = Buffer(content);
        callback(err, file);
      });
    // Streams
    } else {
      file.contents = file.contents.pipe(new BufferStreams(fileMarked()));
      callback(null, file);
    }
  });

};

// Export the file level transform function for other plugins usage
gulpMarked.fileTransform = fileMarked;

// Export the plugin main function
module.exports = gulpMarked;

