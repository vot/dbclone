#!/usr/bin/env node
const _ = require('lodash');
const async = require('async');

const fsBackend = require('./backends/fs');
const mongoBackend = require('./backends/mongo');
const resolveSelections = require('./utils/resolveSelections');
const typecast = require('./utils/typecast');
const parsePotentialArray = require('./utils/parsePotentialArray');

const LIMIT = 1;

/**
 * Actual logic to import multiple collections
 * from defined directory (reads all JSON files)
 *
 * @param {opts.collections} array list of collections to import
 * @param {opts.connection} MongoDBClient an instance of MongoDB client connected to DB
 * @param {opts.dataDir} string source directory with the data
 * @param {callback} function A standard callback with function(err) signature
 */
function importCollections(opts, callback) {
  const list = opts.collections;
  const dbConn = opts.connection;
  const dataDir = opts.dataDir;

  if (!Array.isArray(list) || !list.length) {
    return callback('No collections provided to importCollections method.');
  }
  if (!dbConn) {
    return callback('MongoDBClient must be provided to importCollections method.');
  }
  if (!dataDir) {
    return callback('dataDir must be provided to importCollections method.');
  }

  function importOne(collection, cb) {
    if (!collection) {
      return cb('> Missing collection name in call to importOne method');
    }
    //console.log(collection);
    collection = /[^/]*$/.exec(collection)[0];

    return fsBackend.readFile(`${dataDir}/${collection}.json`, (readErr, readData) => {
    //return fsBackend.readFile(`${collection}.json`, (readErr, readData) => {
      if (readErr) {
        return cb(readErr);
      }

      if (opts.verbose) {
        console.log(`┌ Importing "${collection}" (${readData.length} documents)`);
      }

      const col = dbConn.collection(collection);
      const dataToInsert = _.map(readData, typecast.unwrap);

      if (!dataToInsert || Array.isArray(dataToInsert) && !dataToInsert.length) {
        return cb();
      }

      return col.insertMany(dataToInsert, (writeErr) => {
        if (writeErr) {
          if (opts.verbose) {
            console.log(`└ Error while importing "${collection}" collection.`);
            console.error(`\x1b[31m  ${writeErr.errmsg}\x1b[0m`);
          }
          // if (writeErr.code === 11000) {
          //   console.log('You can ignore index restoration with --noIndex');
          //   console.log('You can try dropping the database and trying again.');
          // }
          return cb(writeErr);
        }

        if (opts.verbose) {
          console.log(`└ Successfully imported "${collection}" collection.`);
        }

        return cb(null, { collection, documents: readData.length });
      });
    });
  }

  // process each file and insert in Mongo
  return async.mapLimit(list, LIMIT, importOne, (importErr, importResult) => {
    if (importErr) {
      return callback(importErr);
    }

    mongoBackend.close(dbConn);
    return callback(null, importResult);
  });
}

/**
 * Main exportable function
 *
 * @param {opts.host} string Database host
 * @param {opts.db} string Database name
 * @param {opts.dataDir} string Local directory with data to import
 * @param {opts.include} array (optional) list of collections to include
 *                             defaults to all collections
 * @param {opts.exclude} array (optional) list of collections to exclude
 *                             (applied after include list; takes precedence)
 * @param {callback} function A standard callback with function(err) signature
 */
function main(opts, callback) {
  if (!opts || !opts.host || !opts.db) {
    throw new Error('"host" and "db" must be provided');
  }

  if (typeof callback !== 'function') {
    throw new Error('"callback" must be provided');
  }

  if (typeof opts.dataDir !== 'string') {
    throw new Error('"dataDir" must be provided');
  }

  const dataDir = fsBackend.resolvePath(opts.dataDir);
  const collectionsToInclude = parsePotentialArray(opts.include);
  const collectionsToExclude = parsePotentialArray(opts.exclude);

  // 1. get collections
  const allCollections = fsBackend.scanDirSync(dataDir);
  const resolved = resolveSelections(
    allCollections,
    collectionsToInclude,
    collectionsToExclude
  );

  mongoBackend.open(opts.host, opts.db, (connErr, connDb) => {
    if (connErr) {
      console.error('Couldn\'t connect to specified MongoDB', connErr);
      return process.exit(2);
    }

    const newOpts = {
      collections: resolved.selected,
      connection: connDb,
      dataDir
    };
    return importCollections(newOpts, callback);
  });
}

module.exports = main;
