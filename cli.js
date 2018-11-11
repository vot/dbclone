#!/usr/bin/env node
const clarg = require('clarg');

const promptForInput = require('./lib/cli/promptForInput');
const parseInput = require('./lib/cli/parseInput');

/**
 * CLI entry point
 *
 * If arguments are specified (at least mode of operation and database)
 * this will dispatch straight to the process and execute it.
 *
 * Otherwise it'll produce an interactive prompt to get data from the user.
 *
 * Listens on the process arguments - this should not be imported programmatically.
 */
function main() {
  if (require.main !== module) {
    return console.log('This file is meant to be executed directly in terminal.');
  }

  const cliArgs = clarg();

  const mode = cliArgs && cliArgs.args && cliArgs.args.length ? cliArgs.args[0] : false;
  const opts = cliArgs.opts;

  if (!mode) {
    return promptForInput();
  }

  return parseInput({ mode, opts });
}

main();
