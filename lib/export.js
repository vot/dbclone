#!/usr/bin/env node
const _ = require('lodash');
const async = require('async');
const fs = require('fs-extra');

const mongo = require('./backends/mongo');
const resolveDir = require('./utils/resolveDir');
const groupCollectionsSelection = require('./utils/groupCollectionsSelection');

function exportCollections(opts, callback) {
  const list = opts.collections;
  const dbConn = opts.connection;
  const dataDir = opts.dataDir;

  function exportOne(collection, cb) {
    if (!collection) {
      return cb('> Missing collection name in call to exportOne method');
    }

    const col = dbConn.collection(collection);
    const query = col.find({});

    return query.count((countErr, countRes) => {
      if (countErr) {
        return cb(countErr);
      }
      console.log(`┌ Exporting "${collection}" (${countRes} documents)`);

      return query.toArray((err, docs) => {
        if (err) {
          return cb(err);
        }

        return fs.ensureDir(dataDir, () => {
          fs.writeJSON(
            `${dataDir}/${collection}.json`, docs,
            { spaces: 2 }, (writeErr) => {
              console.log(`└ Successfully exported "${collection}" collection.`);
              return cb(writeErr);
            }
          );
        });
      });
    });
  }


  async.eachLimit(list, 1, exportOne, (exportErr) => {
    if (exportErr) {
      console.error(exportErr);
      return callback(exportErr);
    }

    console.log('------------------');
    console.log('Finished exporting data from Mongo');
    console.log('------------------');
    mongo.close(dbConn);
    return callback();
  });
}

/**
 * Main exportable function
 */
function main(opts, callback) {
  if (!opts || !opts.host || !opts.db) {
    throw new Error('"host" and "db" must be provided');
  }

  if (typeof callback !== 'function') {
    throw new Error('"callback" must be provided');
  }

  const dataDir = resolveDir(opts.dataDir || './data');
  const collectionsToInclude = opts.include || [];
  const collectionsToExclude = opts.exclude || [];

  console.log(`Exporting to ${dataDir}`);

  mongo.open(opts.host, opts.db, (connErr, connDb) => {
    if (connErr) {
      console.error('Couldn\'t connect to specified MongoDB', connErr);
      return process.exit(2);
    }

    console.log('------------------');
    console.log('Starting export...');
    console.log('------------------');

    const newOpts = {
      collections: collectionsToInclude,
      connection: connDb,
      dataDir
    };

    return connDb.listCollections().toArray((listErr, listData) => {
      const allCollections = _.map(listData, 'name');
      const grouped = groupCollectionsSelection(
        allCollections,
        collectionsToInclude,
        collectionsToExclude
      );

      newOpts.collections = grouped.selected;

      return exportCollections(newOpts, callback);
    });
  });
}

module.exports = main;
