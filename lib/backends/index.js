const backendFs = require('./fs');
const backendMongo = require('./mongo');

module.exports = {
  fs: backendFs,
  mongo: backendMongo
};
