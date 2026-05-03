import { Request, Response, NextFunction } from "express";

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL = 5 * 60 * 1000;

export const responseCache = (
  ttl: number = DEFAULT_TTL,
  keyPrefix: string = ""
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `${keyPrefix}${req.originalUrl}`;
    const entry = cache.get(cacheKey);

    if (entry && Date.now() - entry.timestamp < ttl) {
      return res.json(entry.data);
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(cacheKey, { data: body, timestamp: Date.now() });
      return originalJson(body);
    };

    next();
  };
};

export const clearCache = (pattern?: string) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

export const cacheMiddleware = responseCache;
