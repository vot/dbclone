#!/usr/bin/env node
const clarg = require('clarg');
const prompt = require('prompt');

const lib = require('./lib');
const resolvePath = require('./lib/backends').fs.resolvePath;

const appVersion = require('./package.json').version;

const schema = {
  properties: {
    mode: {
      pattern: /^(import|export|drop|count)$/,
      type: 'string',
      message: 'Mode must equal "import" or "export".',
      required: true
    },
    host: {
      pattern: /^[a-zA-Z0-9.,:-]+$/,
      type: 'string',
      message: 'A valid host must be provided.',
      default: '127.0.0.1'
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

function parseInput(result) {
  if (!result || !result.mode) {
    return console.log(`Couldn't pick a mode from provided input: ${JSON.stringify(result, null, 2)}`);
  }

  /* Info modes */
  if (result.mode === 'version') {
    return console.log(`dbclone version ${appVersion}`);
  }

  /* Action modes */
  const optsObj = result.opts || result || {};

  if (!(optsObj.host || result.host) && !(optsObj.db || result.db)) {
    return console.log('Missing database info. Please specify --host and --db');
  }


  if (result.mode === 'import') {
    return lib.import(optsObj, () => {
      console.log('Import finished.');
    });
  }

  if (result.mode === 'export') {
    return lib.export(optsObj, () => {
      console.log('Export finished.');
    });
  }

  if (result.mode === 'count') {
    return lib.count(optsObj, () => {
      console.log('Count finished.');
    });
  }

  if (result.mode === 'drop') {
    if (optsObj.force) {
      return lib.drop(optsObj, () => {
        console.log('Drop database finished.');
      });
    }

    const confirmMsg = `Are you sure you want to drop database "${optsObj.db}" from host "${optsObj.host}"? (y/n)`;

    const schemaConfirmDrop = {
      properties: {
        answer: {
          pattern: /^(y|n|yes|no)$/,
          type: 'string',
          message: 'You must answer with "y" or "n"',
          required: true
        }
      }
    };

    console.log(confirmMsg);

    prompt.start();

    return prompt.get(schemaConfirmDrop, (err, confirmResult) => {
      if (err) {
        return process.exit(1);
      }

      const confirmDrop = confirmResult.answer;

      if (confirmDrop !== 'y' && confirmDrop !== 'yes') {
        return console.log('Aborted.');
      }

      return lib.drop(optsObj, () => {
        console.log('Drop database finished.');
      });
    });
  }

  console.log('Couldn\'t resolve mode');
  return false;
}

function promptForInput() {
  console.log('dbclone');
  console.log('---------------------\n');
  console.log('Supported modes:   import, export, count, drop');
  console.log('Default host:      localhost');
  console.log(`Default data dir:  ${resolvePath('data')}`);
  console.log('\n---------------------\n');

  prompt.start();

  prompt.get(schema, (err, result) => {
    if (err) {
      return process.exit(1);
    }
    return parseInput(result);
  });
}


function main() {
  // if things are specified in CLI args
  const cliArgs = clarg();

  const mode = cliArgs && cliArgs.args && cliArgs.args.length ? cliArgs.args[0] : false;
  const opts = cliArgs.opts;

  if (!mode) {
    return promptForInput();
  }

  return parseInput({ mode, opts });
}

main();
