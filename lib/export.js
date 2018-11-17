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
 * Actual logic to export multiple collections
 * from selected database
 *
 * @param {opts.collections} array list of collections to export
 * @param {opts.connection} MongoDBClient an instance of MongoDB client connected to DB
 * @param {opts.dataDir} string destination directory for the data
 * @param {callback} function A standard callback with function(err) signature
 */
function exportCollections(opts, callback) {
  const list = opts.collections;
  const dbConn = opts.connection;
  const dataDir = opts.dataDir;

  if (!Array.isArray(list) || !list.length) {
    return callback('No collections provided to exportCollections method.');
  }
  if (!dbConn) {
    return callback('MongoDBClient must be provided to exportCollections method.');
  }
  if (!dataDir) {
    return callback('dataDir must be provided to exportCollections method.');
  }

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
      // console.log(`┌ Exporting collection: "${collection}" (${countRes} documents)`);

      return query.toArray((err, docs) => {
        if (err) {
          return cb(err);
        }

        return fsBackend.ensureDir(dataDir, () => {
          fsBackend.writeFile(
            `${dataDir}/${collection}.json`,
            _.map(docs, typecast.wrap),
            { spaces: 2 },
            (writeErr, writeSuccess) => {
              if (writeErr) {
                // console.log(`└ ERR Problem exporting collection: "${collection}".`);
                return cb(writeErr);
              }
              // console.log(`└ Successfully exported collection: "${collection}".`);
              return cb(null, { collection, documents: countRes });
            }
          );
        });
      });
    });
  }

  // start exporting all resolved collections
  return async.mapLimit(list, LIMIT, exportOne, (exportErr, exportData) => {
    if (exportErr) {
      // console.log('------------------');
      // console.log('Errors during export from Mongo');
      // console.log('------------------');
      // console.error(exportErr);
      return callback(exportErr);
    }

    // console.log('------------------');
    // console.log('Finished exporting data from Mongo');
    // console.log('------------------');
    mongoBackend.close(dbConn);
    return callback(null, exportData);
  });
}

/**
 * Main exportable function
 *
 * @param {opts.host} string Database host
 * @param {opts.db} string Database name
 * @param {opts.dataDir} string (optional) Local directory for data export
 *                              defaults to ./data/[date]_[database-name]
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

  const dataDir = fsBackend.resolvePath(opts.dataDir || './data');
  const collectionsToInclude = parsePotentialArray(opts.include);
  const collectionsToExclude = parsePotentialArray(opts.exclude);

  // console.log(`Exporting to ${dataDir}`);

  mongoBackend.open(opts.host, opts.db, (connErr, connDb) => {
    if (connErr) {
      console.error('Couldn\'t connect to specified MongoDB', connErr);
      return process.exit(2);
    }

    // console.log('------------------');
    // console.log('Starting export...');
    // console.log('------------------');

    return mongoBackend.listCollections(connDb, (err, allCollections) => {
      const resolved = resolveSelections(
        allCollections,
        collectionsToInclude,
        collectionsToExclude
      );

      const newOpts = {
        collections: resolved.selected,
        connection: connDb,
        dataDir
      };

      return exportCollections(newOpts, callback);
    });
  });
}

module.exports = main;
