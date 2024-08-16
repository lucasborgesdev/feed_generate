"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deploy = deploy;
var _api = require("../../api");
async function deploy() {
  try {
    console.log('Connecting to the OCC admin server...');
    const {
      data: {
        access_token
      }
    } = await _api.occAPI.login();
    console.log('Uploading bundle file...');
    const {
      data: {
        success
      }
    } = await _api.occAPI.uploadExtension(access_token);
    console.log(`${success ? 'Successful' : 'Unsuccessful'} deployment.`);
  } catch (error) {
    console.error('Deployment error.', _api.occAPI.getErrorData(error));
  }
}