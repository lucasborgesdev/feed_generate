"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _firebase = require("./firebase");
Object.keys(_firebase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _firebase[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _firebase[key];
    }
  });
});