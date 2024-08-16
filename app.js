"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("dotenv/config");
var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _routes = require("./routes");
var _connectTimeout = _interopRequireDefault(require("connect-timeout"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const app = (0, _express.default)();
app.use((0, _connectTimeout.default)('90s'));
app.use(_bodyParser.default.json());
app.use(_routes.routes);
app.use((req, res, next) => {
  if (!req.timedout) next();
});
var _default = app;
exports.default = _default;