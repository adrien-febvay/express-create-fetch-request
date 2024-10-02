/* eslint-disable @typescript-eslint/await-thenable */
import { createFetchRequest } from '.';
import EventEmitter from 'events';

const headers = { 'content-type': 'text/plain;charset=UTF-8', 'set-cookie': ['a=1', 'b=1'] };

function _createFetchRequest(method: string) {
  const res = new EventEmitter();
  // @ts-expect-error Sending partial objects, only what is needed to test createFetchRequest.
  const req = createFetchRequest({ method, get: () => 'localhost', headers, body: 'some data' }, res);
  return { req, res };
}

function entries(headers: { [Key in string]: string | string[] }) {
  return Object.entries(headers)
    .map(([key, value]) => (value instanceof Array ? value.map((subvalue) => [key, subvalue]) : [[key, value]]))
    .flat(1);
}

async function streamToString(stream: ReadableStream) {
  const chunks: Buffer[] = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore The stream has an async iterator.
  for await (const chunk of stream) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

describe('createFetchFunction', () => {
  it('Converts a GET request', () => {
    const { req } = _createFetchRequest('GET');
    expect(req).toBeInstanceOf(Request);
    expect(req.method).toBe('GET');
    expect([...req.headers.entries()]).toMatchObject(entries(headers));
    expect(req.body).toBe(null);
  });

  it('Converts a POST request', async () => {
    const { req } = _createFetchRequest('POST');
    expect(req).toBeInstanceOf(Request);
    expect(req.method).toBe('POST');
    expect([...req.headers.entries()]).toMatchObject(entries(headers));
    expect(req.body && (await streamToString(req.body))).toBe('some data');
  });

  it('Makes an abortable request', () => {
    const mockCallback = jest.fn();
    const { req, res } = _createFetchRequest('HEAD');
    req.signal.onabort = mockCallback;
    expect(req.method).toBe('HEAD');
    expect([...req.headers.entries()]).toMatchObject(entries(headers));
    expect(mockCallback).toHaveBeenCalledTimes(0);
    res.emit('close');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
