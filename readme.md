# dbclone

[![NPM Version][npm-img]][npm-url]
[![NPM Downloads][npm-dl-img]][npm-url]

[npm-url]: https://npmjs.org/package/dbclone
[npm-img]: https://img.shields.io/npm/v/dbclone.svg
[npm-dl-img]: https://img.shields.io/npm/dm/dbclone.svg


*Utility to move data between Mongo hosts and/or databases effortlessly.*

**Features**
- Import/export MongoDB databases
- Automatic selection of all collections
- Include/exclude collections for partial imports and exports

## Usage in terminal

You can use `dbclone` command in your terminal if you install the package
globally (`npm install dbclone -g`).

**CLI OPTIONS**

Two modes are supported: `import` and `export`.

They both need the MongoDB URI (including database name).

You can also specify the data directory to give more flexibility.

**At the moment only interactive mode is implemented.**

<!--
<br />

**@TODO / EXAMPLE** Cloning database from a remote host into a local DB with a date in its name

```
dbclone export --host mongo.myapp.com --db=myapp-data-prod --datadir data/20180622-app-data-dump-20180622
dbclone import --host localhost --db=20180622-myapp-data-prod --datadir data/20180622-app-data-dump
```
-->

## Usage in Node.js apps

TBD. See [example.js](./example.js) for a quick demo.

## TODO

- support db dropping, counting documents and diffing two databases
- add backends for other database types
- destructive mode (drop db before import to force clean state)
- non-interactive mode in CLI
- cleaner interfaces in libs
- documentation

## Release notes

v0.0.1

- basic import and export functionality
