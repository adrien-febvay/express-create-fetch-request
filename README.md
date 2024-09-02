# Express createFetchRequest
![CI Tests status](https://github.com/adrien-febvay/express-create-fetch-request/actions/workflows/ci-tests.yml/badge.svg)

This package is just about a simple function used to create a fetch request from an Express request.

This is needed for instance for a React project with SSR (https://reactrouter.com/en/main/routers/create-static-handler#createstatichandler).

## Install

```sh
npm install express-create-fetch-request
```

## Usage

```js
import { createFetchRequest } from 'express-create-fetch-request';

export async function myExpressMiddleware(req, res) {
  const fetchRequest = createFetchRequest(req, res);
  ...
}
```

## Credits

### Author

Adrien Febvay https://github.com/adrien-febvay
