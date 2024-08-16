"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helloRoutes = void 0;
var _helpers = require("../helpers");
var _express = require("express");
var _services = require("../services");
var _HelloController = require("../controllers/HelloController");
const feedService = new _services.FeedService();
const helloController = new _HelloController.HelloController(feedService);
const helloRoutes = (0, _express.Router)();
exports.helloRoutes = helloRoutes;
helloRoutes.get(_helpers.routeHelper.getRoutePath('/generate'), helloController.process);