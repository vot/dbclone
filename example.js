const exportRoutine = require('./lib/export');
const importRoutine = require('./lib/import');

const exportOpts = {
  host: 'localhost',
  db: 'example-data-prod',
  dataDir: 'data/20180622-example-data-prod',
  exclude: ['files', 'sessions']
};

const importOpts = {
  host: 'localhost',
  db: '20180622-example-data-prod',
  dataDir: 'data/20180622-example-data-prod',
  exclude: ['config']
};

exportRoutine(exportOpts, () => {
  importRoutine(importOpts, () => {});
});
