const CACHE_TIME = 5 * 60 * 1000;
const cache = new Map();

export const setCache = (key, data) => {
  cache.set(key, { data, time: Date.now() });
};

export const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.time > CACHE_TIME) {
    cache.delete(key);
    return null;
  }
  return cached.data;
};
