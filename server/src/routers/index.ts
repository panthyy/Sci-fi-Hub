import { publicProcedure, router } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure.query(async () => {
    return "Hello World!";
  }),
});
