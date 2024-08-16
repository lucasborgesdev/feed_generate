"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _httpException = require("./http-exception");
Object.keys(_httpException).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _httpException[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _httpException[key];
    }
  });
});
var _httpStatus = require("./http-status");
Object.keys(_httpStatus).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _httpStatus[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _httpStatus[key];
    }
  });
});