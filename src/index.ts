
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export function createFetchRequest(req: ExpressRequest, res: ExpressResponse) {
  const origin = `${req.protocol}://${req.get('host')}`;
  const url = new URL(req.originalUrl || req.url, origin);

  const controller = new AbortController();
  res.on('close', () => controller.abort());

  const headers = new Headers();

  for (const key in req.headers) {
    const values = req.headers[key];
    if (Array.isArray(values)) {
      for (const value of values) {
        headers.append(key, value);
      }
    } else if (values) {
      headers.set(key, values);
    }
  }

  return new Request(url.href, {
    method: req.method,
    headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : void 0,
    signal: controller.signal,
  });
};