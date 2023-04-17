import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "./context";
import { router } from "./trpc";
import * as routers from "./routers";

const appRouter = router(routers);

export type ENV = {
  NODE_ENV: "development" | "production";
  kv: KVNamespace;
  d1: D1Database;
};
export default {
  async fetch(
    request: Request,
    env: ENV,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }
    const f = fetchRequestHandler({
      endpoint: "/trpc",
      req: request,
      router: appRouter,
      createContext: createContext(env),
    });

    return new Promise((resolve, reject) => {
      try {
        f.then((res) => {
          res.headers.set("Access-Control-Allow-Origin", "*");
          resolve(res);
        }).catch((err) => {
          console.log(err);
          reject(err);
        });
      } catch (error) {
        console.log(error);
        reject(
          new Response("Internal Server Error", {
            status: 500,
          })
        );
      }
    });
  },
};

export type AppRouter = typeof appRouter;
