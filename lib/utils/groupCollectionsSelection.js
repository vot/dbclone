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

  console.log('All available collections in the source DB:');
  console.log(allCollections.join(', '));
  console.log();

  if (!skippedCollections.length) {
    console.log('Exporting all collections.');
    console.log();
  } else {
    console.log('Selected collections:');
    console.log(selectedCollections.join(', '));
    console.log();
    console.log('Skipping collections:');
    console.log(skippedCollections.join(', '));
    console.log();

    console.log('Collections not in DB:');
    console.log(missingCollections.join(', '));
    console.log();
  }

  console.log('------------------');

  return {
    all: allCollections,
    skipped: skippedCollections,
    selected: selectedCollections
  };
}

module.exports = groupCollectionsSelection;
