import { provideServerRendering, withRoutes } from "@angular/ssr";
import { type ApplicationConfig, mergeApplicationConfig } from "@angular/core";
import { appConfig } from "./app.config";
import { serverRoutes } from "./app.routes.server";

const serverConfig: ApplicationConfig = {
  // Angular 22 no longer auto-discovers `app.routes.server.ts`; the route tree
  // used by the prerenderer and the runtime server must be provided explicitly.
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
