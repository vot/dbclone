const _ = require('lodash');
const mongodb = require('mongodb');

const ObjectID = mongodb.ObjectID;

/**
 * Wraps a single value into an object
 * @param {*} val Any value taken directly from DB
 * @returns {object} Wrapped object with properties: type, value
 */
function wrapSingleValue(val) {
  let detectedType = typeof val;

  if (typeof val === 'object') {
    if (ObjectID.isValid(val)) {
      detectedType = 'ObjectID';
    }

    if (Array.isArray(val)) {
      detectedType = 'array';
    }

    if (!val) {
      detectedType = 'null';
    }
  }

  const wrapped = {
    type: detectedType,
    value: val
  };

  return wrapped;
}

/**
 * Unwraps/casts a single value from a previously wrapped object
 * Casts MongoIDs to the correct type
 *
 * @param {object} wrapper Value wrapped in an object with type and value
 * @returns {*} Unwrapped/casted value matching what was originally taken from DB
 */
function unwrapSingleValue(wrapper) {
  // console.log('unwrapSingleValue', wrapper);
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
