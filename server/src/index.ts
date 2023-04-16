import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "./context";
import { exampleRouter } from "./routers";
import { router } from "./trpc";

export type ENV = {
  NODE_ENV: "development" | "production";
};

const appRouter = router({
  example: exampleRouter,
});
export default {
  async fetch(request: Request, env: ENV, ctx: ExecutionContext): Promise<Response> {
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
          reject(err);
        });
      } catch (error) {
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
