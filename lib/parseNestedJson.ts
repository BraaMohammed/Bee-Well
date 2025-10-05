//@ts-ignore
export function parseNestedJSON(obj) {
    if (typeof obj === 'string') {
      try {
        const parsed = JSON.parse(obj);
        return parseNestedJSON(parsed);
      } catch (e) {
        return obj;
      }
    } else if (Array.isArray(obj)) {
      return obj.map(parseNestedJSON);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        //@ts-ignore
        Object.entries(obj).map(([key, value]) => [key, parseNestedJSON(value)])
      );
    } else {
      return obj;
    }
  }