"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _noSqlDatabase = require("./no-sql-database");
Object.keys(_noSqlDatabase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _noSqlDatabase[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _noSqlDatabase[key];
    }
  });
});