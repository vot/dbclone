const inquirer = require('inquirer');
const parseInput = require('./parseInput');
const appVersion = require('../utils/appVersion');

function generateTimestamp() {
  const now = new Date();
  const timestamp = now.toISOString().split('.')[0].replace(/:/g, '').replace(/-/g, '').replace('T', '-');
  return timestamp;
}

function generateDataDir(answers) {
  if (answers.mode === 'import') {
    return `${answers.db}-YYYYMMDD-HHMMSS`;
  }

  return `${answers.db}-${generateTimestamp()}`;
}

const questions = [
  {
    type: 'list',
    name: 'mode',
    message: 'Select mode',
    choices: ['Import', 'Export', 'Count', 'Drop'],
    filter: val => val.toLowerCase()
  },
  {
    type: 'input',
    name: 'host',
    message: 'Host (host name or full Mongo URI)',
    default: 'localhost',
    validate: value => !!value.length || 'Please provide target host name'
  },
  {
    type: 'input',
    name: 'db',
    message: 'Database name',
    validate: value => !!value.length || 'Please provide target database name'
  },
  /**
   * Data directory - relevant for imports and exports
   */
  {
    type: 'input',
    name: 'dataDir',
    message: 'Data directory',
    default: answers => generateDataDir(answers),
    when: answers => ['import', 'export'].indexOf(answers.mode) !== -1,
    validate: value => !!value.length || 'Please provide target data directory'
  },
  /**
   * Collection - relevant for count
   */
  {
    type: 'input',
    name: 'collections',
    message: 'Collections',
    when: answers => ['count'].indexOf(answers.mode) !== -1,
    validate: value => !!value.length || 'Please provide collection to count'
  },
  /**
   * Filtering and additional options - better workflow needed
   */
  // {
  //   type: 'list',
  //   name: 'filter',
  //   message: 'Collection filtering',
  //   choices: ['None', 'Include', 'Exclude'],
  //   filter: val => val.toLowerCase()
  // },
  // {
  //   type: 'list',
  //   name: 'hide-secrets',
  //   message: 'Hide secrets',
  //   choices: ['No', 'Yes'],
  //   filter: val => val.toLowerCase()
  // },
];


function promptForInput() {
  console.log(`dbclone v${appVersion}`);
  console.log('Type "dbclone help" for more information and instructions.\n');

  inquirer.prompt(questions).then(answers => parseInput(answers));
}

module.exports = promptForInput;
