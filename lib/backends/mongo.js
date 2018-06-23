const MongoClient = require('mongodb').MongoClient;

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

  return MongoClient.connect(url, (err, client) => {
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

module.exports = {
  open: dbConnectionOpen,
  close: dbConnectionClose
};
