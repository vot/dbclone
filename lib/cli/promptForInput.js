const prompt = require('prompt');
const parseInput = require('./parseInput');

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

function promptForInput() {
  console.log('dbclone 0.0.3');
  console.log('Type "dbclone help" for instructions.');
  console.log();

  prompt.start();

  prompt.get(schema, (err, result) => {
    if (err) {
      return process.exit(1);
    }
    return parseInput(result);
  });
}

module.exports = promptForInput;
