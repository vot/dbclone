function parsePotentialArray(data) {
  const parsed = typeof data === 'string' ? data.split(',') : data;

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}

module.exports = parsePotentialArray;
