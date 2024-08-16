"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFilePromise = void 0;
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const writeFilePromise = (filename, content) => {
  return new Promise((resolve, reject) => {
    _fs.default.writeFile(filename, '', error => {
      if (error) {
        reject(error);
        return;
      }
      const stream = _fs.default.createWriteStream(filename, {
        flags: 'a'
      });
      stream.write(content, error => {
        if (error) reject(error);else resolve();
      });
    });
  });
};
exports.writeFilePromise = writeFilePromise;