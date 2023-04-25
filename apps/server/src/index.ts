import { createContext } from "./context";
import { router } from "./trpc";
import * as routers from "./routers";
import fastify from "fastify";
import { pool } from "./database";
import dotenv from "dotenv";
dotenv.config();
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { TRPCError } from "@trpc/server";
const app = fastify();

const appRouter = router(routers);

app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    onError: (err: any) => {
      console.error({
        code: err.error.code,
        name: err.error.name,
        path: err.path,
        input: err.input,
        error: err.error,
      });
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    },
    createContext: createContext({ pool }),
  },
});

(async () => {
  console.log("Server listening on port http://localhost:8080");
  await app.listen({
    port: 8080,
  });
})();

export type ENV = {
  NODE_ENV: "development" | "production";
  kv: KVNamespace;
  d1: D1Database;
};

export type AppRouter = typeof appRouter;
