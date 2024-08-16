"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _HelloController = require("./HelloController");
Object.keys(_HelloController).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _HelloController[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _HelloController[key];
    }
  });
});