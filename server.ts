import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from "@angular/ssr/node";
import express from "express";

// The Express app is exported so that it can be used by serverless Functions.
const angularApp = new AngularNodeAppEngine();

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, "../browser");

  server.use(
    express.static(browserDistFolder, {
      maxAge: "1y",
      index: false,
      redirect: false,
    }),
  );

  // Serve prerendered pages and render remaining Angular routes.
  server.use((req, res, next) => {
    angularApp
      .handle(req)
      .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch((err) => next(err));
  });

  return server;
}

const server = app();

if (isMainModule(import.meta.url)) {
  const port = process.env["PORT"] || 4000;
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(server);
