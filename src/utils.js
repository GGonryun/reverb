const randomStringGenerator = () => {
  return Math.random().toString(36).substring(2, 15);
};

// <@U08LL6W3KBR|amodestduck>
const parseUser = (userString) => {
  if (!userString) {
    return null;
  }
  const regex = /<@(\w+)/; // Matches <@USERID>
  const match = userString.match(regex);
  if (match && match[1]) {
    return match[1]; // Return the user ID
  } else {
    return undefined; // Return undefined if no match found
  }
};

const compact = (object) => {
  // must recursively remove all null and undefined values
  const isObject = (obj) => obj && typeof obj === "object";
  const isArray = Array.isArray;
  const isNullOrUndefined = (value) => value === null || value === undefined;
  const compactObject = (obj) => {
    if (isArray(obj)) {
      return obj.map(compactObject).filter((item) => !isNullOrUndefined(item));
    } else if (isObject(obj)) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (!isNullOrUndefined(value)) {
          acc[key] = compactObject(value);
        }
        return acc;
      }, {});
    }
    return obj;
  };
  return compactObject(object);
};

module.exports = {
  randomStringGenerator,
  parseUser,
  compact,
};
