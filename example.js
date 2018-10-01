const exportRoutine = require('./lib/export');
const importRoutine = require('./lib/import');
const countRoutine  = require('./lib/count');

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

const countOpts = {
  host: 'localhost',
  db: '20180622-example-data-prod',
  collections: ['example', 'users', 'prod']
};

exportRoutine(exportOpts, () => {
  importRoutine(importOpts, () => {});
});

countRoutine(countOpts, () => { })
