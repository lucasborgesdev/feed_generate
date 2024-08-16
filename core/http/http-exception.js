"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpException = void 0;
var _httpStatus = require("./http-status");
class HttpException extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpException';
  }
  static parse(error) {
    if (error instanceof HttpException) return error;
    return new HttpException(_httpStatus.HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}
exports.HttpException = HttpException;