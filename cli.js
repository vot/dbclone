#!/usr/bin/env node
const clarg = require('clarg');
const prompt = require('prompt');
const importRoutine = require('./lib/import');
const exportRoutine = require('./lib/export');
const resolvePath = require('./lib/backends/fs').resolvePath;

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

function interactiveMode() {
  console.log('dbclone');
  console.log('---------------------\n');
  console.log('Supported modes:   import, export');
  console.log('Default host:      localhost');
  console.log(`Default data dir:  ${resolvePath('data')}`);
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


function main() {
  // if things are specified in CLI args
  const cliArgs = clarg();

  const mode = cliArgs && cliArgs.args && cliArgs.args.length ? cliArgs.args[0] : false;
  const opts = cliArgs.opts;

  if (!mode) {
    return interactiveMode();
  }

  console.log('Mode selected through CLI args:', mode);

  if (!opts.host || !opts.db) {
    return console.log('Missing database info. Please specify --host and --db');
  }

  if (mode === 'import') {
    return importRoutine(opts, () => {
      console.log('Import finished.');
    });
  }

  if (mode === 'export') {
    return exportRoutine(opts, () => {
      console.log('Export finished.');
    });
  }
}

main();
