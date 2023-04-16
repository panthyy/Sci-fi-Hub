import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  isDev: false,
});

export const middleware = t.middleware;

export const router = t.router;
export const publicProcedure = t.procedure;
