const _ = require('lodash');

function groupCollectionsSelection(allCollections, include, exclude) {
  let selectedCollections;

  if (!Array.isArray(include) || !include.length) {
    selectedCollections = allCollections;
  }

  if (!Array.isArray(exclude) || !exclude.length) {
    selectedCollections = _.difference(selectedCollections, exclude);
  }

  const skippedCollections = _.difference(allCollections, selectedCollections);
  const missingCollections = _.difference(include, selectedCollections);

  console.log(`All available collections ${allCollections.length}:`);
  console.log(allCollections.join(', '), '\n');

  if (!skippedCollections.length) {
    console.log('Using all collections.', '\n');
  } else {
    console.log('Selected collections:');
    console.log(selectedCollections.join(', '), '\n');

    console.log('Skipping collections:');
    console.log(skippedCollections.join(', '), '\n');

    console.log('Collections not in DB:');
    console.log(missingCollections.join(', '), '\n');
  }

  console.log('------------------');

  return {
    all: allCollections,
    skipped: skippedCollections,
    selected: selectedCollections
  };
}

module.exports = groupCollectionsSelection;
