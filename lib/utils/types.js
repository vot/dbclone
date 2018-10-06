const _ = require('lodash');
const mongodb = require('mongodb');

const ObjectID = mongodb.ObjectID;

function wrapSingleValue(val) {
  let detectedType = typeof val;

  if (ObjectID.isValid(val)) {
    detectedType = 'ObjectID';
  }

  if (Array.isArray(val)) {
    detectedType = 'array';
  }

  const wrapped = {
    type: detectedType,
    value: val
  };

  return wrapped;
}

function unwrapSingleValue(wrapper) {
  console.log('unwrapSingleValue', wrapper);
  let unwrapped = wrapper.val;

  if (wrapper.type === 'ObjectID') {
    unwrapped = ObjectID(unwrapped);
  }

  return unwrapped;
}

function wrap(payload) {
  const rtn = {};
  _.each(payload, (v, k) => {
    if (typeof v === 'object' && !Array.isArray(v) && !ObjectID.isValid(v)) {
      rtn[k] = wrap(v);
    }

    rtn[k] = wrapSingleValue(v);
  });
  return rtn;
}

function unwrap(payload) {
  const rtn = {};
  _.each(payload, (v, k) => {
    if (v.type === 'object') {
      rtn[k] = unwrap(v);
    }

    rtn[k] = unwrapSingleValue(v);
  });
  return rtn;
}

module.exports = {
  wrap,
  unwrap
};
