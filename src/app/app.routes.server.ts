import { RenderMode, type ServerRoute } from "@angular/ssr";

/**
 * Dashboard routes are authenticated and read the session cookie, which the
 * server never has. Rendering them on the server only produces empty widgets
 * and unauthenticated API calls (401s in the build/server log), so they are
 * rendered on the client instead.
 */
const clientRoutes = [
  "dashboard",
  "accounts",
  "entries",
  "exits",
  "transfers",
  "analysis",
  "savings",
  "reminders",
  "credit-cards",
  "debit-cards",
  "loans",
].map<ServerRoute>((path) => ({ path, renderMode: RenderMode.Client }));

export const serverRoutes: ServerRoute[] = [
  ...clientRoutes,
  { path: "**", renderMode: RenderMode.Prerender },
];
