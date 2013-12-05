var es = require('event-stream');
var marked = require('marked');

module.exports = function(opt) {

  marked.setOptions(opt || {});

  return es.map(function (file, callback) {
    marked(String(file.contents), function (err, content) {
      if (!err) file.contents = content;
      callback(err, file);
    });
  });

};