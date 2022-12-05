'use strict';

const ORG = process.env.ORG || 'duranx';
const REPO = 'rx7910/berserk';
const BASE_IMAGE_NAME = `${ORG}/pupils-base`;
const STRAPI_IMAGE_NAME = `${ORG}/pupils`;
const NODE_VERSIONS = [10, 12, 14];
const LATEST_NODE_VERSION = 14;

module.exports = {
  ORG,
  REPO,
  BASE_IMAGE_NAME,
  STRAPI_IMAGE_NAME,
  NODE_VERSIONS,
  LATEST_NODE_VERSION,
};
