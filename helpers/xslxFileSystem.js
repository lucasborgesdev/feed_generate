"use strict";

const fs = require('fs').promises;
const writeFileXlsx = async base64Info => {
  await fs.writeFile('redirect-links.xlsx', base64Info, {
    encoding: 'base64'
  }, (err, success) => {
    if (err) return err;else success;
  });
};
const deleteFileXlsx = async () => {
  await fs.unlink('redirect-links.xlsx', function (err) {
    if (err) err;
  });
};
module.exports = {
  writeFileXlsx,
  deleteFileXlsx
};