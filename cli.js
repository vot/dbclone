#!/usr/bin/env node
const prompt = require('prompt');
const importRoutine = require('./lib/import');
const exportRoutine = require('./lib/export');
const resolveDir = require('./lib/utils/resolveDir');

const schema = {
  properties: {
    mode: {
      pattern: /^(import|export)$/,
      type: 'string',
      message: 'Mode must equal "import" or "export".',
      required: true
    },
    host: {
      pattern: /^[a-zA-Z0-9.,:-]+$/,
      type: 'string',
      message: 'A valid host must be provided.',
      default: 'localhost'
    },
    db: {
      pattern: /^[a-zA-Z0-9.,:-]+$/,
      type: 'string',
      message: 'A valid Mongo database name must be provided.',
      required: true
    },
    dataDir: {
      type: 'string',
      default: 'data'
    }
    // username: {
    //   type: 'string'
    // },
    // password: {
    //   type: 'string',
    //   hidden: true
    // },
    // include: {
    //   type: 'string'
    // },
    // exclude: {
    //   type: 'string'
    // }
  }
};

function main() {
  console.log('dbclone');
  console.log('---------------------\n');
  console.log('Supported modes:   import, export');
  console.log('Default host:      localhost');
  console.log(`Default data dir:  ${resolveDir('data')}`);
  console.log('\n---------------------\n');

  prompt.start();

  prompt.get(schema, (err, result) => {
    if (result.mode === 'import') {
      return importRoutine(result, () => {
        console.log('Import finished.');
      });
    }

    if (result.mode === 'export') {
      return exportRoutine(result, () => {
        console.log('Export finished.');
      });
    }

    console.log('Couldn\'t resolve mode');
    return false;
  });
}

main();
