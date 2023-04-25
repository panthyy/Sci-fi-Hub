import { tables } from "@drizzle/*";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import movies from "./movies.json";
import genres from "./genres.json";

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
    try {
      return new Response("Hello World!");
    } catch (error) {
      console.log(error);
      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  },
};
