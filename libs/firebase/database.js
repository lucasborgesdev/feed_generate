"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FirebaseDatabase = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FirebaseDatabase {
  async save(path, value) {
    const url = `${process && process.env && process.env.FIREBASE_DATABASE_URL || "https://salon-debug-a6f70-default-rtdb.firebaseio.com"}/${path}.json?auth=${process && process.env && process.env.FIREBASE_DATABASE_SECRET || "BvxaiuZvwLLeMjL9GUYNzNTmxswve09tUNGunOKE"}`;
    await _axios.default.put(url, value);
  }
}
exports.FirebaseDatabase = FirebaseDatabase;