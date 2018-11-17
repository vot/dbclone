# dbclone

[![NPM Version][npm-img]][npm-url]
[![NPM Downloads][npm-dl-img]][npm-stat-url]
[![MIT License][license-img]][license-link]
[![Build status][circle-img]][circle-url]
[![Code coverage][coveralls-img]][coveralls-url]

[npm-url]: https://npmjs.org/package/dbclone
[npm-stat-url]: https://npm-stat.com/charts.html?package=dbclone
[npm-img]: https://img.shields.io/npm/v/dbclone.svg
[npm-dl-img]: https://img.shields.io/npm/dm/dbclone.svg
[circle-img]: https://img.shields.io/circleci/project/github/vot/dbclone/master.svg
[circle-url]: https://circleci.com/gh/vot/dbclone/tree/master
[coveralls-img]: https://img.shields.io/coveralls/github/vot/dbclone/master.svg
[coveralls-url]: https://coveralls.io/github/vot/dbclone?branch=master

[license-img]: https://img.shields.io/badge/license-MIT-blue.svg
[license-link]: https://spdx.org/licenses/MIT


*Utility to move data between NoSQL databases.*

The major difference between this and mongodump is that I like this syntax more.

dbclone also makes storing multiple backups and restoring them easier.
It's also more controlled as you can change the target database names during
these operations, whitelist or blacklist collections you'd like to use.

It also includes a few extra utils like dropping databases and counting collection sizes.

Currently it only supports MongoDB but other backends are also planned.


## Usage in terminal

You can use `dbclone` command in your terminal if you install the package
globally (`npm install dbclone -g`).

**CLI OPTIONS**

Supported modes: `import`, `export`, `count`, `drop`.

They need MongoDB host (`--host`) and database name (`--db`).

You can also specify additional options  (`--datadir`, `--exclude`)

Count mode expects `--collections` specified.

Drop mode prompts for confirmation by default - you can override this with `--force`.

<br />

**EXAMPLES** Cloning database from a remote host into a local DB with a date in its name

```
dbclone export --host mongo.myapp.com --db=myapp-data --datadir data/20180622-myapp-data --exclude files
dbclone drop --host localhost --db=myapp-data --force
dbclone import --host localhost --db=myapp-data --datadir data/20180622-myapp-data
dbclone count --host localhost --db=myapp-data --collections pages,files
```

**MongoDB URI - Authentication, replica sets**

You can provide a fully qualified Mongo URI as host option.

In order to authenticate with username and password you can use the following syntax:

```
dbclone export --host mongodb://username:p4ssw0rd@ds111111.mlab.com:11111/my-database --db my-database
```


## Usage in Node.js apps

```
const dbclone = require('dbclone');

const exportOpts = {
  host: 'mongodb://username:p4ssw0rd@ds111111.mlab.com:11111',
  db: 'example-data-prod',
  dataDir: 'data/20180622-example-app-data',
  exclude: ['files', 'sessions']
};

const importOpts = {
  host: 'localhost',
  db: '20180622-example-data-prod',
  dataDir: 'data/20180622-example-app-data',
  exclude: ['config']
};

const countOpts = {
  host: 'localhost',
  db: '20180622-example-app-data',
  collections: ['users', 'prod']
};

dbclone.export(exportOpts, (exportErr, exportData) => {
  dbclone.import(importOpts, (importErr, importData) => {
    dbclone.count(countOpts, (countErr, countData) => {
      dbclone.drop(dropOpts, (dropErr, dropData) => {
        console.log('Test completed!');
      });
    });
  });
});
```


## TODO

- support diffing of two databases/data dirs (enumerate collections, compare document counts)
- support for indexed properties (opt-out through `--noIndex` flag)
- add backends for other database types (DynamoDB to begin with)
- support multiple conflict resolution strategies (`overwrite`/`merge`/`replace` - write new data on top of existing/only copy missing records/drop original contents first)
- add `clone` mode which grabs data from source database and copies it to another
- add `rename` mode which will do a `clone` on the same server and drop the original database
- clean and consistent interfaces in libs
- documentation and full JSDoc comments coverage
- prepare testing strategy
- implement tests as necessary


## Release notes

### v0.0.4

- **Maintenance:** split up CLI logic into individual pieces
- **Bugfix:** passing values correctly through callbacks
- **Feature:** friendlier interactive prompt mode
- **Feature:** `--verbose` flag
- **Feature:** consistent output in CLI


### v0.0.3

- **Maintenance:** cleaned up file structure
- **Feature:** added `drop` method (thanks *@Dikaeinstein*)
- **Feature:** added `version` method


### v0.0.2

- **Maintenance:** changed license from deprecated `LGPL-3.0` to `MIT`
- **Bugfix:** preserving correct types (fixes problem with ObjectIDs imported as strings)
- **Bugfix:** fixed include/exclude parsing
- **Feature:** added `count` method (thanks *@thiagormagalhaes*)


### v0.0.1

- basic import and export functionality
