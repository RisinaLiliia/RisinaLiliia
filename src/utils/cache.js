const CACHE_TIME = 5 * 60 * 1000;


const MAX_CACHE_SIZE = 500;

const cache = new Map();


const removeExpiredEntries = () => {
  const now = Date.now();

  for (const [key, cached] of cache.entries()) {
    if (now - cached.time >= CACHE_TIME) {
      cache.delete(key);
    }
  }
};


const enforceSizeLimit = () => {
  while (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;

    if (oldestKey === undefined) {
      break;
    }

    cache.delete(oldestKey);
  }
};

export const setCache = (key, data) => {
  removeExpiredEntries();


  if (cache.has(key)) {
    cache.delete(key);
  }


  enforceSizeLimit();

  cache.set(key, {
    data,
    time: Date.now(),
  });
};

export const getCache = (key) => {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  if (Date.now() - cached.time >= CACHE_TIME) {
    cache.delete(key);
    return null;
  }


  cache.delete(key);
  cache.set(key, cached);

  return cached.data;
};


const cleanupTimer = setInterval(() => {
  removeExpiredEntries();
}, 60 * 1000);


cleanupTimer.unref?.();
