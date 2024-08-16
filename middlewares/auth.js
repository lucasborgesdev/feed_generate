"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicAuth = void 0;
const errResponse = {
  message: 'the user is not authenticated'
};
const basicAuth = (req, res, next) => {
  const APP_PASSWORD = process && process.env && process.env.APP_PASSWORD || "ba90eeaee42a2f7cdba161a487111db8" || '';
  const APP_USER = process && process.env && process.env.APP_USER || "lighthouse" || '';

  // check for basic auth header
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json(errResponse);
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  if (username !== APP_USER || APP_PASSWORD !== password) {
    return res.status(401).json(errResponse);
  }
  return next();
};
exports.basicAuth = basicAuth;