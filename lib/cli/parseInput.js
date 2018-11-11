const _ = require('lodash');
const inquirer = require('inquirer');
const lib = require('..');
const generateHelpText = require('./generateHelpText');

/**
 * @param {string} opts.message Question for the user
 * @param {function} opts.actionFn Callback function
 */
function confirmSelection(opts) {
  if (opts.force) {
    return opts.actionFn({ confirm: 'yes' });
  }

  const questions = [{
    type: 'list',
    name: 'confirm',
    message: opts.message,
    choices: ['Yes', 'No'],
    filter: val => val.toLowerCase()
  }];

  return inquirer.prompt(questions).then(answers => opts.actionFn(answers));
}

function displayDetailedSummary(data) {
  return _.each(data, (col) => {
    if (col && col.collection) {
      const outputLine = `${_.padEnd(col.collection, 18, '.')}${_.padStart(col.documents, 8, '.')} documents`;
      console.log(outputLine);
    }
  });
}

function exportAction(opts) {
  console.log(`Starting export of "${opts.db}" (${opts.host}) to "${opts.dataDir}"\n`);

  return lib.export(opts, (err, data) => {
    if (err) {
      console.error('Export error:', err);
    }

    console.log(`Successfully exported ${data.length} collections from "${opts.db}" (${opts.host}) to "${opts.dataDir}"\n`);

    return displayDetailedSummary(data);
  });
}

function importAction(opts) {
  console.log(`Starting import of "${opts.dataDir}" to "${opts.db}" (${opts.host})\n`);

  return lib.import(opts, (err, data) => {
    if (err) {
      console.error('Import error:', err);
    }

    console.log(`Successfully imported ${data.length} collections to "${opts.db}" (${opts.host})\n`);

    return displayDetailedSummary(data);
  });
}

function countAction(opts) {
  return lib.count(opts, (err, data) => {
    console.log(`Counting documents in "${opts.db}" (${opts.host})...\n`);

    if (err) {
      return console.error('Count error:', err);
    }

    return displayDetailedSummary(data);
  });
}

function dropAction(opts) {
  const message = `Are you sure you want to drop database "${opts.db}" from host "${opts.host}"?`;

  const actionFn = (confirmResult) => {
    if (confirmResult.confirm !== 'yes') {
      return console.log('Database drop aborted.');
    }

    console.log(`Dropping database "${opts.db}" on "${opts.host}"...\n`);

    return lib.drop(opts, (err, data) => {
      if (err) {
        console.error('Drop error:', err);
      }

      console.log(`Database "${opts.db}" (${opts.host}) dropped successfully (${data}).`);
    });
  };

  return confirmSelection({ message, actionFn, force: opts.force });
}

function helpAction() {
  const helpTextString = generateHelpText();
  return console.log(helpTextString);
}


const Actions = {
  export: exportAction,
  import: importAction,
  count: countAction,
  drop: dropAction,
  help: helpAction,
};

/**
 * @param {object} result Data collected from the user either through
 * CLI arguments or interactive prompt
 */
function parseInput(result) {
  if (!result || !result.mode || !Actions[result.mode]) {
    console.log(`Couldn't locate selected mode: "${result ? result.mode : result}"`);
    return process.exit(1);
  }

  if (result.mode === 'help') {
    return Actions.help();
  }

  const optsObj = result.opts || result || {};

  // default host to localhost
  optsObj.host = optsObj.host || 'localhost';

  if (!(optsObj.db || result.db)) {
    return console.log('Missing database info. Please specify --db parameter.');
  }

  if (optsObj.verbose) {
    console.log('----------------------------------');
    console.log(`Host:         ${optsObj.host}`);
    console.log(`Selected DB:  ${optsObj.db}`);
    console.log('----------------------------------');
  }

  if (result.mode === 'import') {
    return Actions.import(optsObj);
  }

  if (result.mode === 'export') {
    return Actions.export(optsObj);
  }

  if (result.mode === 'count') {
    return Actions.count(optsObj);
  }

  // Drop database
  if (result.mode === 'drop') {
    return Actions.drop(optsObj);
  }

  throw new Error('Couldn\'t match provided mode');
}

module.exports = parseInput;
