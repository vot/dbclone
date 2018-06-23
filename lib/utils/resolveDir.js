const path = require('path');

function resolveDir(dir) {
  const resolved = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
  return resolved;
}

module.exports = resolveDir;
