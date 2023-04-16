import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { ENV } from ".";

export const createContext =
  (env: ENV) =>
  async ({ req }: FetchCreateContextFnOptions) => {
    return {
      req,
      env,
    };
  };
// get return type of a function
const temp = createContext({} as any);

export type Context = inferAsyncReturnType<typeof temp>;
