import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { ENV } from ".";
import { drizzle } from "drizzle-orm/d1";
export const createContext =
  (env: ENV) =>
  async ({ req }: FetchCreateContextFnOptions) => {
    const db = drizzle(env.d1);
    return {
      db,
      req,
      env,
    };
  };
// get return type of a function
const temp = createContext({} as any);

export type Context = inferAsyncReturnType<typeof temp>;
