"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoutePath = void 0;
const getRoutePath = path => {
  const parsedPath = path.startsWith('/') ? path.slice(1) : path;
  let startPath = process && process.env && process.env.BASE_ROUTE || "/v1/feedGenerator/";
  startPath = startPath.startsWith('/') ? startPath.slice(1) : startPath;
  startPath = startPath.endsWith('/') ? startPath.slice(0, -1) : startPath;
  return `/${startPath}/${parsedPath}`;
};
exports.getRoutePath = getRoutePath;