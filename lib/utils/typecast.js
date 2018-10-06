const _ = require('lodash');
const mongodb = require('mongodb');

const ObjectID = mongodb.ObjectID;

/**
 * Detects type of a value and identifies ObjectIDs, arrays and nulls
 * as the correct type rather than just object
 */
function detectType(val) {
  if (typeof val === 'object') {
    if (ObjectID.isValid(val)) {
      return 'ObjectID';
    }

    if (Array.isArray(val)) {
      return 'array';
    }

    if (val === null) {
      return 'null';
    }
  }

  const detectedType = typeof val;
  return detectedType;
}

/**
 * Wraps a single value into an object
 * @param {*} val Any value taken directly from DB
 * @return {object} Wrapped object with properties: type, value
 */
function wrapSingleValue(value) {
  const detectedType = detectType(value);

  const wrapped = {
    type: detectedType,
    value: value
  };

  return wrapped;
}

/**
 * Unwraps/casts a single value from a previously wrapped object
 * Casts Mongo ObjectIDs to the correct type
 *
 * @param {object} wrapper Value wrapped in an object with type and value
 * @return {*} Unwrapped/casted value matching what was originally taken from DB
 */
function unwrapSingleValue(wrapper) {
  // console.log('unwrapSingleValue', wrapper);
  let unwrapped = wrapper.value;

  if (wrapper.type === 'ObjectID') {
    unwrapped = ObjectID(unwrapped);
  }

  return unwrapped;
}

/**
 * Runs the wrapping of values over an entire payload/document
 *
 * @param {object} payload Entire document from database to interate over
 * @return {object} Document mapped to include types and values for every property
 */
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
