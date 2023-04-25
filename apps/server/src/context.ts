import { inferAsyncReturnType } from "@trpc/server";
import { ENV } from ".";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export const createContext =
  (config: { pool: Pool }) =>
  async ({ req }: CreateFastifyContextOptions) => {
    const db = drizzle(config.pool);

    return {
      db,
      req,
    };
  };
// get return type of a function
const temp = createContext({} as any);

export type Context = inferAsyncReturnType<typeof temp>;
