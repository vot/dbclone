const exportRoutine = require('./lib/export');
const importRoutine = require('./lib/import');
const countRoutine = require('./lib/count');

const importOpts = {
  host: 'localhost',
  db: 'dbclone-dev',
  dataDir: 'dbclone-dev-20180622',
  exclude: ['config', 'private']
};

const exportOpts = {
  host: 'localhost',
  db: 'dbclone-dev',
  dataDir: 'dbclone-dev-20181024',
  exclude: ['files', 'sessions']
};

const countOpts = {
  host: 'localhost',
  db: 'dbclone-dev',
  collections: ['pages', 'configs', 'prod']
};

importRoutine(importOpts, (importErr, importData) => {
  if (importErr) {
    console.error('Import Error:', importErr);
  }
  console.log('Import Data:', importData);

  exportRoutine(exportOpts, (exportErr, exportData) => {
    if (exportErr) {
      console.error('Export Error:', exportErr);
    }
    console.log('Export Data:', exportData);

    countRoutine(countOpts, (countErr, countData) => {
      if (countErr) {
        console.error('Count Error:', countErr);
      }
      console.log('Count Data:', countData);
    });
  });
});
