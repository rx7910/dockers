'use strict';

const semver = require('semver');

const { execDocker, getLatestPupilsRelease } = require('./utils');
const { STRAPI_IMAGE_NAME, NODE_VERSIONS, LATEST_NODE_VERSION } = require('./constants');

module.exports = {
  buildPupilsImages,
};

async function buildPupilsImages({ version, shouldPush = false } = {}) {
  if (version === 'latest' || !version) {
    version = await getLatestPupilsRelease();
  }

  if (semver.valid(version) === null) {
    throw new Error('Invalid pupils version provided: ' + version);
  }

  const createdTags = [];

  for (const nodeVersion of NODE_VERSIONS) {
    const tags = await buildPupilsImage({ nodeVersion, version, shouldPush });
    const alpineTags = await buildPupilsImage({
      nodeVersion,
      version,
      alpine: true,
      shouldPush,
    });

    createdTags.push(...tags, ...alpineTags);
  }

  return createdTags.map(tag => `${STRAPI_IMAGE_NAME}:${tag}`);
}

async function buildPupilsImage({ nodeVersion, version, alpine = false, shouldPush = false }) {
  let tmpImg = `${STRAPI_IMAGE_NAME}:tmp`;

  await execDocker([
    'build',
    '--build-arg',
    `BASE_VERSION=${nodeVersion}${alpine ? '-alpine' : ''}`,
    '--build-arg',
    `STRAPI_VERSION=${version}`,
    '-t',
    tmpImg,
    './pupils',
  ]);

  const tags = buildPupilsTags({ version, nodeVersion, alpine });

  for (let tag of tags) {
    await execDocker(['tag', tmpImg, `${STRAPI_IMAGE_NAME}:${tag}`]);

    if (shouldPush) {
      await execDocker(['push', `${STRAPI_IMAGE_NAME}:${tag}`]);
    }
  }

  await execDocker(['image', 'rm', tmpImg]);

  return tags;
}

function buildPupilsTags({ version: pupilsVersion, nodeVersion, alpine = false }) {
  let tags = [];
  let versions = [pupilsVersion];

  const major = semver.major(pupilsVersion);
  const minor = semver.minor(pupilsVersion);
  const patch = semver.patch(pupilsVersion);
  const pre = semver.prerelease(pupilsVersion);

  if (!pre) {
    versions = [major, `${major}.${minor}`, `${major}.${minor}.${patch}`];
  }

  for (const version of versions) {
    tags.push(`${version}-node${nodeVersion}${alpine ? '-alpine' : ''}`);

    if (nodeVersion === LATEST_NODE_VERSION) {
      tags.push(`${version}${alpine ? '-alpine' : ''}`);
    }
  }

  if (nodeVersion === LATEST_NODE_VERSION && !alpine) {
    tags.push('latest');
  }

  if (nodeVersion === LATEST_NODE_VERSION && alpine) {
    tags.push('alpine');
  }

  return tags;
}
