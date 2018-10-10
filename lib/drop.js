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
      mongoBackend.close(dbConn);
    })
    .catch((dropErr) => {
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

  return mongoBackend.open(opts.host, opts.db, (connErr, connDb) => {
    if (connErr) {
      console.error('Couldn\'t connect to specified MongoDB', connErr);
      return process.exit(2);
    }

    console.log(`Dropping database "${opts.db}"...`);

    const newOpts = {
      connection: connDb,
      dbName: opts.db,
    };

    return dropDatabase(newOpts, callback);
  });
}

module.exports = main;
