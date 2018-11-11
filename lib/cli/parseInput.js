const prompt = require('prompt');
const lib = require('..');
const generateHelpText = require('./generateHelpText');

function parseInput(result) {
  if (!result || !result.mode) {
    return console.log(`Couldn't pick a mode from provided input: ${JSON.stringify(result, null, 2)}`);
  }

  /* Info modes */
  if (result.mode === 'help') {
    const helpTextString = generateHelpText();
    return console.log(helpTextString);
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

module.exports = parseInput;
