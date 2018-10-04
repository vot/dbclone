const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;

/**
 * For now using shared sockets seems to make enough sense.
 * If performance becomes an issue look into pooling multiple connections.
 */
let MongoClientInstance;
let MongoDBInstance;

/**
 * Establish a connection.
 *
 * @param {string} host MongoDB host
 * @param {string} db Database name
 * @param {callback} cb Function with signature of (err, db)
 */
function dbConnectionOpen(host, db, cb) {
  if (MongoDBInstance) {
    return cb(null, MongoDBInstance);
  }

  const url = host.startsWith('mongodb://') ? host : `mongodb://${host}`;

  return MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err || !client) {
      const errorMsg = `Couldn't connect to Mongo at ${url}`;
      console.error(errorMsg, err);
      return cb(err || errorMsg);
    }

    console.log(`Host:        ${host}`);
    console.log(`Selected DB: ${db}`);
    MongoClientInstance = client;
    MongoDBInstance = client.db(db);
    return cb(null, MongoDBInstance);
  });
}

/**
 * Closes a connection
 */
function dbConnectionClose() {
  MongoDBInstance = null;
  if (MongoClientInstance) {
    MongoClientInstance.close();
  }
}


function listCollections(connDb, callback) {
  console.log('(Scanning Mongo...)\n');

  return connDb.listCollections().toArray((listErr, listData) => {
    const allCollections = _.map(listData, 'name');
    return callback(null, allCollections);
  });
}

function countDocuments(connDb, collection, callback) {
  const coll = connDb.collection(collection);

  return coll.countDocuments()
    .then(count => callback(null, count));
}

/**
 * Drops database
 * @param {Object} connDb Database instance
 * @param {Function} callback Function with signature (err, result)
 *
 * @returns {Promise}
 */
function dropDatabase(connDb, callback) {
  console.log('Dropping database...\n');

  return connDb.dropDatabase()
    .then(result => callback(null, result))
    .catch(err => callback(err));
}

const mongoBackend = {
  _socketHost: MongoClientInstance,
  _socketDatabase: MongoDBInstance,

  open: dbConnectionOpen,
  close: dbConnectionClose,
  listCollections,
  // dropCollection
  dropDatabase,
  // findDocument
  countDocuments
  // insertDocument
  // removeDocument
};

module.exports = mongoBackend;
