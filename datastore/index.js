const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = '';
  counter.getNextUniqueId((err, data) => {
    if (err) {
      throw error;
    } else {
      id += data;
      var todoPath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(todoPath, text, (err) => {
        if (err) {
          throw err;
        } else {
          items[id] = text;
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw err;
    } else {
      var todos = [];
      files.forEach((file) => {
        var id = file.substring(0, 5);
        todos.push({id: id, text: id});
      });
      callback(null, todos);
    }
  });
  // var data = _.map(items, (text, id) => {
  //   console.log('items: ', items);
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw err;
    } else {
      var hasId = false;
      files.forEach((file) => {
        var fileId = file.substring(0, 5);
        if (fileId === id) {
          hasId = true;
          var filePath = path.join(exports.dataDir, file);
          fs.readFile(filePath, (err, fileData) => {
            if (err) {
              throw err;
            } else {
              callback(null, {id: id, text: fileData.toString()});
            }
          });
        }
      });
      if (hasId === false) {
        callback(new Error(`No item with id: ${id}`));
      }
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw err;
        } else {
          fileData.text = text;
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  exports.readOne(id, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      fs.unlink(filePath, (err) => {
        if (err) {
          throw err;
        } else {
          callback();
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
