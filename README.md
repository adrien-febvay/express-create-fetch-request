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

## React SSR Example
```jsx
import React from 'react';
import { StaticRouterProvider } from 'react-router-dom/server';
import { createStaticHandler, createStaticRouter } from 'react-router-dom/server';
import { createFetchRequest } from 'express-create-fetch-request';
import Component, { loader, ErrorBoundary } from './my-app';

const routes = [{ path: '/', loader, Component, ErrorBoundary }];

export async function renderHtml(req, res) {
  const { query, dataRoutes } = createStaticHandler(routes);
  const fetchRequest = createFetchRequest(req, res);
  const context = await query(fetchRequest);

  // If we got a redirect response, short circuit and let our Express server
  // handle that directly
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </React.StrictMode>
  );
}
```

## Credits

### Author

Adrien Febvay https://github.com/adrien-febvay
