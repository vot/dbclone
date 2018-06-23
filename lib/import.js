#!/usr/bin/env node
const _ = require('lodash');
const async = require('async');
const fs = require('fs-extra');
const glob = require('glob');

const mongo = require('./backends/mongo');
const resolveDir = require('./utils/resolveDir');
const groupCollectionsSelection = require('./utils/groupCollectionsSelection');

function importCollections(opts, callback) {
  // return callback();

  const list = opts.collections;
  const dbConn = opts.connection;
  const dataDir = opts.dataDir;

  function importOne(collection, cb) {
    if (!collection) {
      return cb('> Missing collection name in call to importOne method');
    }

    return fs.readJSON(`${dataDir}/${collection}.json`, (readErr, readData) => {
      if (readErr) {
        return cb(readErr);
      }

      console.log(`┌ Importing "${collection}" (${readData.length} documents)`);

      const col = dbConn.collection(collection);
      return col.insertMany(readData, (writeErr) => {
        console.log(`└ Successfully imported "${collection}" collection.`);
        return cb(writeErr);
      });
    });
  }


  async.eachLimit(list, 1, importOne, (importErr) => {
    if (importErr) {
      console.error(importErr);
      return callback(importErr);
    }

    console.log('------------------');
    console.log('Finished importing data to Mongo');
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

  console.log('------------------');
  console.log('Starting import...');
  console.log('------------------');

  console.log(`Scanning ${dataDir}\n`);

  // 1. get collections
  const allCollections = _.map(
    glob.sync(`${dataDir}/*`),
    entry => entry.replace(`${dataDir}/`, '').replace('.json', '')
  );

  console.log(`Found ${allCollections.length} importable collections.\n`, allCollections.join(', '));


  const grouped = groupCollectionsSelection(
    allCollections,
    collectionsToInclude,
    collectionsToExclude
  );

  // console.log(grouped);
  //
  mongo.open(opts.host, opts.db, (connErr, connDb) => {
    if (connErr) {
      console.error('Couldn\'t connect to specified MongoDB', connErr);
      return process.exit(2);
    }

    const newOpts = {
      collections: grouped.selected,
      connection: connDb,
      dataDir
    };

    return importCollections(newOpts, callback);
  });
}

module.exports = main;
