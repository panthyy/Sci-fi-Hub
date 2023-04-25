import { like } from "drizzle-orm";
import { z } from "zod";
import { tables } from "../drizzle";
import { publicProcedure, router } from "../trpc";

export const genre = router({
  search: publicProcedure
    .input(
      z
        .object({
          query: z.string(),
          limit: z.number().optional().default(5),
        })
        .optional()
        .default({
          query: "",
          limit: 5,
        })
    )
    .output(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        })
      )
    )
    .mutation(async ({ ctx: { db }, input: { query, limit } }) => {
      const genres = await db
        .select({
          id: tables.genres.id,
          name: tables.genres.name,
        })
        .from(tables.genres)
        .where(like(tables.genres.name, `%${query}%`))
        .limit(limit);

      return genres;
    }),
  popularGenres: publicProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(5),
        })
        .optional()
        .default({
          limit: 5,
        })
    )
    .output(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        })
      )
    )
    .query(async ({ ctx: { db }, input: { limit } }) => {
      const genres = await db
        .select({
          id: tables.genres.id,
          name: tables.genres.name,
        })
        .from(tables.genres)
        .limit(limit);

      return genres;
    }),
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
          .limit(limit);
        return genres;
      });

      return {
        results: genres,
        offset: offset + limit,
      };
    }),
});
