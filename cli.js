const prompt = require('prompt');
const importRoutine = require('./lib/import');
const exportRoutine = require('./lib/export');

const schema = {
  properties: {
    mode: {
      pattern: /^(import|export)$/,
      message: 'Mode must be "import" or "export".',
      required: true
    },
    host: {
      pattern: /^[a-zA-Z0-9.,:-]+$/,
      message: 'Mongo host must be provided.',
      required: true
    },
    db: {
      pattern: /^[a-zA-Z0-9.,:-]+$/,
      message: 'Mongo database name must be provided.',
      required: true
    },
    dataDir: {
      // hidden: true
    }
  }
};

function main() {
  console.log('dbclone');
  console.log('---------------------\n');
  console.log('Supported modes:   "import" / "export"');
  console.log('MongoURL format:   "mongodb://localhost/database"');
  console.log('Default data dir:  "data"');
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
