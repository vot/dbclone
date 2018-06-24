const _ = require('lodash');

/**
 * Resolves a final list of collections
 * based on lists of all collections, include and exclude.
 *
 * @returns [ { name: 'collection', state: '*' } ]
 * where state = 'selected' || 'skipped' || 'missing'
 */

function resolveSelections(all, include, exclude) {
  if (!Array.isArray(all) || !all.length) {
    return [];
  }

  const listInc = Array.isArray(include) && include.length ? include : all;
  const listExc = Array.isArray(exclude) ? exclude : [];

  const aggregated = _.map(all, (col) => {
    // mark items in exclude list or not present in include list as "skipped"
    if (listExc.indexOf(col) !== -1 || listInc.indexOf(col) === -1) {
      return { name: col, state: 'skipped' };
    }

    // mark items in include list as "selected"
    return { name: col, state: 'selected' };
  });

  _.each(listInc, (col) => {
    // mark collections in include list but not found in database as "missing"
    const found = _.find(aggregated, { name: col });
    if (!found) {
      aggregated.push({ name: col, state: 'missing' });
    }
  });
  _.each(listExc, (col) => {
    // mark collections in exclude list but not found in database as "missing"
    const found = _.find(aggregated, { name: col });
    if (!found) {
      aggregated.push({ name: col, state: 'missing' });
    }
  });

  const aggForDisplay = _.map(aggregated, (col) => {
    if (col.state === 'selected') {
      return `+ ${col.name}`;
    }
    if (col.state === 'skipped') {
      return `- ${col.name}`;
    }
    return `? ${col.name}`;
  });

  console.log(`${all.length} collections available:`);
  console.log(aggForDisplay.join('\n'));
  console.log('------------------');

  return {
    full: aggregated,
    selected: _.map(_.filter(aggregated, { state: 'selected' }), 'name')
  };
}

module.exports = resolveSelections;
