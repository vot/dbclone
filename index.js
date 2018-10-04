#!/usr/bin/env node
const exportLib = require('./lib/export');
const importLib = require('./lib/import');
const dropDatabaseLib = require('./lib/drop');

if (require.main === module) {
  // eslint-disable-next-line global-require
  require('./cli');
}

module.exports = {
  export: exportLib,
  import: importLib,
  dropDatabase: dropDatabaseLib,
};
