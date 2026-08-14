import type { Plugin } from "vite";
import { handleApiRoute } from "./api.js";

export function apiDevPlugin(): Plugin {
  return {
    name: "api-dev-server",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRoute(req, res).then((handled) => {
          if (!handled) next();
        }).catch(next);
      });
    },
  };
}
