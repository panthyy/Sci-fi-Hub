import { tables } from "@drizzle/*";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const genre = router({
  list: publicProcedure

    .input(
      z
        .object({
          limit: z.number().optional().default(50),
          offset: z.number().optional().default(0),
        })
        .optional()
        .default({
          limit: 50,
          offset: 0,
        })
    )

    .output(
      z.object({
        results: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
          })
        ),
        offset: z.number(),
      })
    )

    .query(async ({ ctx: { db }, input: { offset, limit } }) => {
      const genres = await db.transaction(async (tx) => {
        const genres = await tx
          .select({
            id: tables.genres.id,
            name: tables.genres.name,
          })
          .from(tables.genres)
          .limit(limit)
          .all();
        return genres;
      });

      return {
        results: genres,
        offset: offset + limit,
      };
    }),
});
