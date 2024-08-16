"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSiteKey = void 0;
const SITE_KEY_REPLACE_REGEX = /(^www.)*(^dev.)*(^tst.)*(^prd.)*(-store)*(-admin)*/g;
const getSiteKey = siteURL => {
  const {
    hostname
  } = new URL(siteURL);
  const [key] = hostname.replace(SITE_KEY_REPLACE_REGEX, '').split('.');
  return key;
};
exports.getSiteKey = getSiteKey;