require('dotenv').config();

const dbclone = require('../lib');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const DATADIR = `data/${Math.random().toString(36).slice(2)}`;
const TEST_MLAB_URL = process.env.TEST_MLAB_URL;
const getDBNameFromURL = URL => URL.slice(URL.lastIndexOf('/') + 1);

before(() => {
  if (!TEST_MLAB_URL) {
    throw new Error('TEST_MLAB_URL env var must be specified');
  }
  rimraf.sync('data');
  mkdirp.sync(DATADIR);
});

describe('Library tests', async () => {
  describe('Export', async () => {
    it('should export data from mLab URL', async () => {
      await new Promise((resolve) => {
        dbclone.export({
          host: TEST_MLAB_URL,
          db: getDBNameFromURL(TEST_MLAB_URL),
          dataDir: DATADIR,
        }, (e, d) => {
          console.log(`e = [${e}]`);
          console.log(`d = [${d}]`);
          resolve();
        });
      });
    });
  });
});
