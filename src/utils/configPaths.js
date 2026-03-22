function setNestedValue(target, path, value) {
  const keys = path.split(".");
  let current = target;

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    if (typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

module.exports = { setNestedValue };
