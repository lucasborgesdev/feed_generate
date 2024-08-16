"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HelloController = void 0;
class HelloController {
  constructor(feedService) {
    this.feedService = feedService;
  }
  process = async (req, res) => {
    try {
      const response = await this.feedService.createFeed();
      return res.status(200).json(response);
    } catch (ex) {
      return res.status(500).json({
        error: ex.response.data
      });
    }
  };
}
exports.HelloController = HelloController;