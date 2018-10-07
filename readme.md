# dbclone

[![NPM Version][npm-img]][npm-url]
[![NPM Downloads][npm-dl-img]][npm-stat-url]
[![MIT License][license-img]][license-link]

[npm-url]: https://npmjs.org/package/dbclone
[npm-stat-url]: https://npm-stat.com/charts.html?package=dbclone
[npm-img]: https://img.shields.io/npm/v/dbclone.svg
[npm-dl-img]: https://img.shields.io/npm/dm/dbclone.svg

[license-img]: https://img.shields.io/badge/license-MIT-blue.svg
[license-link]: https://spdx.org/licenses/MIT


*Utility to move data between NoSQL databases.*

**Features**
- Import/export MongoDB databases
- Automatic selection of all collections
- Include/exclude collections for partial imports and exports


## Usage in terminal

You can use `dbclone` command in your terminal if you install the package
globally (`npm install dbclone -g`).

**CLI OPTIONS**

Supported modes: `import`, `export`, `count`.

They need MongoDB host (`--host`) and database name (`--db`).

You can also specify additional options  (`--datadir`, `--exclude`)

<br />

**@TODO / EXAMPLE** Cloning database from a remote host into a local DB with a date in its name

```
dbclone export --host mongo.myapp.com --db=myapp-data --datadir data/20180622-myapp-data --exclude files
dbclone import --host localhost --db=myapp-data --datadir data/20180622-myapp-data
dbclone count --host localhost --db=myapp-data --collections pages,files
```


## Usage in Node.js apps

```
const dbclone = require('dbclone');

const exportOpts = {
  host: 'localhost',
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
      console.log('Test completed!');
    });
  });
});
```


## TODO

- support diffing of two databases/export data sets
- support for indexed properties (opt-out: --noIndex)
- add backends for other database types
- conflict resolution strategies (`merge`/`overwrite`/`replace` - only copy missing data/write new data on top of existing/drop first and start clean)
- clean and consistent interfaces in libs
- documentation


## Release notes

### v0.0.2

- **Maintenance:** changed license from deprecated `LGPL-3.0` to `MIT`
- **Bugfix:** preserving correct types (fixes problem with ObjectIDs imported as strings)
- **Bugfix:** fixed include/exclude parsing
- **Feature:** added count method (thanks @thiagormagalhaes)


### v0.0.1

- basic import and export functionality
