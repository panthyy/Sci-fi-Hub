import { TRPCError } from "@trpc/server";
import { and, asc, desc, ilike, InferModel, like, sql } from "drizzle-orm";
import { z, ZodLazy } from "zod";
import { tables } from "../drizzle";
import { publicProcedure, router } from "../trpc";

type Movie = InferModel<typeof tables.movies>;

export const movies = router({
  hello: publicProcedure.query(async ({ ctx: { db } }) => {
    return "Hello World!";
  }),
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(50),
          offset: z.number().optional().default(0),
          orderBy: z.string().optional().default("year"),
        })
        .optional()
        .default({
          limit: 50,
          offset: 0,
          orderBy: "year",
        })
    )
    .query(async ({ ctx: { db }, input }) => {
      const { limit, offset, orderBy } = input;

      const movie = await db
        .select({
          title: tables.movies.title,
          released: tables.movies.released,
          rating: tables.movies.rating,
          id: tables.movies.id,
        })
        .from(tables.movies)
        .limit(limit)
        .offset(offset)
        .execute();

      console.log(movie);
      const total = await db
        .select({
          total: sql`count(*)`,
        })
        .from(tables.movies)
        .limit(1);

      return {
        results: movie,
        offset: offset + limit,
        total: total[0].total as number,
      };
    }),
  search: publicProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(50),
          offset: z.number().optional().default(0),
          orderBy: z.string().optional().default("year"),
          query: z.string().optional().default(""),
          filterBy: z
            .object({
              genres: z.array(z.number()).optional().default([]),
              yearGte: z.number().optional().default(0),
              yearLte: z.number().optional().default(0),
            })
            .optional()
            .default({
              yearGte: 0,
              yearLte: new Date().getFullYear(),
            }),
        })
        .optional()
        .default({
          limit: 50,
          offset: 0,
          orderBy: "year",
          query: "",
          filterBy: {
            yearGte: 0,
            yearLte: 0,
          },
        })
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const { limit, offset, orderBy, query } = input;
      const movies = await db
        .select({
          title: tables.movies.title,
          released: tables.movies.released,
          rating: tables.movies.rating,
          id: tables.movies.id,
        })
        .from(tables.movies)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(tables.movies[orderBy as keyof Movie]))
        .where(
          and(
            query === "" ? sql`1 = 1` : like(tables.movies.title, `%${query}%`),

            sql`(${tables.movies.released} >= ${input.filterBy.yearGte})`,
            sql`(${tables.movies.released} <= ${input.filterBy.yearLte})`
          )
        )
        .catch((e) => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        });

      const total = await db
        .select({
          total: sql`count(*)`,
        })
        .from(tables.movies)
        .limit(1)
        .where(sql`LOWER(${tables.movies.title}) LIKE LOWER(${sql`${query}`})`);

      return {
        results: movies,
        offset: offset + limit,
        total: total[0].total as number,
      };
    }),
});
