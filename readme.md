# dbclone

[![NPM Version][npm-img]][npm-url]
[![NPM Downloads][npm-dl-img]][npm-stat-url]
[![LGPL-3.0 License][license-img]][license-link]

[npm-url]: https://npmjs.org/package/dbclone
[npm-stat-url]: https://npm-stat.com/charts.html?package=dbclone
[npm-img]: https://img.shields.io/npm/v/dbclone.svg
[npm-dl-img]: https://img.shields.io/npm/dm/dbclone.svg

[license-img]: https://img.shields.io/badge/license-LGPL--3.0-blue.svg
[license-link]: https://spdx.org/licenses/LGPL-3.0


*Utility to move data between NoSQL databases.*

**Features**
- Import/export MongoDB databases
- Automatic selection of all collections
- Include/exclude collections for partial imports and exports

## Usage in terminal

You can use `dbclone` command in your terminal if you install the package
globally (`npm install dbclone -g`).

**CLI OPTIONS**

Two modes are supported: `import` and `export`.

They both need MongoDB host and database name).

You can also specify the data directory for more flexibility.

<!--
<br />

**@TODO / EXAMPLE** Cloning database from a remote host into a local DB with a date in its name

```
dbclone export --host mongo.myapp.com --db=myapp-data --datadir data/20180622-myapp-data
dbclone import --host localhost --db=myapp-data --datadir data/20180622-myapp-data
dbclone count --host localhost --db=myapp-data --collections pages,files
```
-->

## Usage in Node.js apps

TBD. See [example.js](./example.js) for a quick demo.

## TODO

- support db dropping, counting documents and diffing two databases
- store data types
- add support for indexed properties
- add backends for other database types
- destructive/clean mode (drop db before import to force clean state)
- force mode (in non-destructive mode) to override existing documents / controlled upsert
- cleaner interfaces in libs
- documentation

## Release notes

v0.0.1

- basic import and export functionality
