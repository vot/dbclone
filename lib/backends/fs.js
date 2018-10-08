const fse = require('fs-extra'); // This module adds file system methods that aren't included in the native 'fs' module and adds promis support to the 'fs' methods.
const glob = require('glob'); // This module matches files using the patterns the shell uses. It uses minimatch library to do the matching.
const map = require('lodash/map'); // Similar to Array.map, but map in lodash is a collection method, which can be used on plain old objects as well.
const path = require('path'); // Provides utilities for working with file and directory paths.

const BASEDIR = process.cwd(); // process.cwd() returns the current working directory

function resolvePath(inputPath) {
  const resolved = path.isAbsolute(inputPath) ? inputPath : path.join(BASEDIR, inputPath);
  return resolved;
} /* This function checks if the path inputted is an absolute path, if it is, the function will return the path as is,
if not, the function will combine the input path with the current working directory and form the absolute path. */

function scanDirSync(dataDir) {
  console.log(`(Scanning ${dataDir}...)\n`);

  return map(
    glob.sync(`${dataDir}/*`),
    entry => entry.replace(`${dataDir}/`, '').replace('.json', '')
  );
} /* This function scans the {dataDir} in the directory and replace it with '.json'. 
This function used glob to find the match, and used map to replace results */

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
