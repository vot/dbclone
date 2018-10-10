#!/usr/bin/env node
const mongoBackend = require('./backends/mongo');

function dropDatabase(opts, callback) {
  const dbConn = opts.connection;
  const dbName = opts.dbName;

  if (!dbConn) {
    return callback('MongoDBClient must be provided to exportCollections method.');
  }

  if (!dbName) {
    return callback('Database name must be provided to drop database');
  }

  return mongoBackend.dropDatabase(dbConn, callback)
    .then(() => {
      console.log('------------------');
      console.log('Finished dropping database from Mongo');
      console.log('------------------');
      mongoBackend.close(dbConn);
      return callback();
    })
    .catch((dropErr) => {
      console.log('------------------');
      console.log('Errors while dropping database from Mongo');
      console.log('------------------');
      console.error(dropErr);
      return callback(dropErr);
    });
}

function main(opts, callback) {
  if (!opts || !opts.host || !opts.db) {
    throw new Error('"host" and "db" must be provided');
  }

  if (typeof callback !== 'function') {
    throw new Error('"callback" must be provided');
  }

  mongoBackend.open(opts.host, opts.db, (connErr, connDb) => {
    if (connErr) {
      console.error('Couldn\'t connect to specified MongoDB', connErr);
      return process.exit(2);
    }

    console.log('------------------');
    console.log('Starting drop database...');
    console.log('------------------');

    const newOpts = {
      connection: connDb,
      dbName: opts.db,
    };

    return dropDatabase(newOpts, callback);
  });
}

module.exports = main;
