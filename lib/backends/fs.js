const fse = require('fs-extra');
const glob = require('glob');
const map = require('lodash/map');
const path = require('path');

const BASEDIR = process.cwd();

function resolvePath(inputPath) {
  const resolved = path.isAbsolute(inputPath) ? inputPath : path.join(BASEDIR, inputPath);
  return resolved;
}

function scanDirSync(dataDir) {
  // console.log(`(Scanning ${dataDir}...)\n`);

  return map(
    glob.sync(`${dataDir}/*`),
    entry => entry.replace(`${dataDir}/`, '').replace('.json', '')
  );
}

const fsBackend = {
  writeFile: fse.writeJSON,
  readFile: fse.readJSON,
  ensureDir: fse.ensureDir,
  // ensureCleanDir,
  resolvePath,
  // deleteDirSync,
  scanDirSync
};

module.exports = fsBackend;
