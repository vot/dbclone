const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient; // including Mongo Database

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

  const url = host.startsWith('mongodb://') ? host : `mongodb://${host}`; // Mongo DB URL

  return MongoClient.connect(url, (err, client) => {
    if (err || !client) {
      const errorMsg = `Couldn't connect to Mongo at ${url}`;
      console.error(errorMsg, err);
      return cb(err || errorMsg);
    } // sends an error message if the connection is unsuccessful

    console.log(`Host:        ${host}`); // output the host name
    console.log(`Selected DB: ${db}`); // output which DB is selected
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
  }); // return all names in the collection
}

// function countDocuments(connDb, collection, callback) {

//   const coll = connDb.collection(collection)
//   return coll.countDocuments().then((count) => {
//     return callback(null, count)
//   }); // return the total number of documents

// }

const mongoBackend = {
  _socketHost: MongoClientInstance,
  _socketDatabase: MongoDBInstance,

  open: dbConnectionOpen,
  close: dbConnectionClose,
  listCollections,
  // dropCollection
  // dropDatabase
  // findDocument
  countDocuments
  // insertDocument
  // removeDocument
};

module.exports = mongoBackend;
