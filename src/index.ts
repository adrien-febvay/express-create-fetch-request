import type * as Express from 'express';

/**
 * Builds a fetch request from an Express request.
 * @param req Express request.
 * @param res Express response.
 * @returns A fetch request.
 *
 * Note: The request body type is not checked. It is assumed it is valid for instanciating a new `Request`.
 */
export function createFetchRequest(req: Express.Request, res: Express.Response) {
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
    // Dirty cast on req.body, but checking it would be too costly.
    body: req.method !== 'GET' && req.method !== 'HEAD' ? (req.body as unknown as InitBody) : void 0,
    signal: controller.signal,
  });
}

export type InitBody = Extract<ConstructorParameters<typeof Request>[1], object>['body'];

// export function isNumberArray<Value>(val: Value): val is Extract<Value, number[] | bigint[] | []> {
//   if (Array.isArray(val)) {
//     for (let index = val.length; index >= 0; index -= 1) {
//       const type = typeof val[index];
//       if (type !== 'number' && type !== 'bigint') {
//         return false;
//       }
//     }
//     return true;
//   } else {
//     return false;
//   }
// }

// export function isValidBody(body: unknown): body is InitBody {
//   return (
//     body == null ||
//     typeof body === 'string' ||
//     body instanceof ArrayBuffer ||
//     body instanceof Blob ||
//     body instanceof FormData ||
//     body instanceof URLSearchParams ||
//     // Does check if iterable, but not if iterable of Uint8Array
//     typeof body[Symbol.iterator as keyof object] === 'function' ||
//     typeof [Symbol.toStringTag] === 'string' ||
//     isNumberArray(body)
//   );
// }
