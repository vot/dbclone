const resolvePath = require('../backends').fs.resolvePath;
const appVersion = require('../../package.json').version;

function generateHelpText() {
  const helpTextString = `dbclone version ${appVersion}

Utility to move data between NoSQL databases.

dbclone supports the following modes:
- import
- export
- count
- drop

When run with no mode specified an interactive prompt will be produced.
It will guide you through the relevant operation.

Alternatively you can specify exact operation you want
to execute by adding it to the command with required parameters, for example:

$ dbclone export --host localhost --db my-app

This will execute export operation to the default directory (data) using all
collections found in the target database.

These modes all require MongoDB host (--host) and a database name (--db).

More parameters are supported. Examples:

$ dbclone export --host localhost --db my-app --dataDir test
$ dbclone export --host localhost --db my-app --exclude private --hide-secrets

You can provide a full Mongo URI to --host option which will allow you
to provide more info like authentication or replica sets.

Default data dir:      "${resolvePath('data')}"

Default target host:   "localhost"
`;

  return helpTextString;
}

module.exports = generateHelpText;
