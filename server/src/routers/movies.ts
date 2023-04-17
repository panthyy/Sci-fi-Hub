import { tables } from "@drizzle/*";
import { and, asc, desc, ilike, InferModel, like, sql } from "drizzle-orm";
import { z, ZodLazy } from "zod";
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
    .output(
      z.object({
        results: z
          .array(
            z.object({
              title: z.string(),
              year: z.number(),
              rating: z.number(),
              id: z.number(),
            })
          )
          .optional()
          .default([]),
        offset: z.number(),
        total: z.number().optional().default(0),
      })
    )
    .query(async ({ ctx: { db }, input }) => {
      const { limit, offset, orderBy } = input;

      const movie = await db
        .select({
          title: tables.movies.title,
          year: tables.movies.year,
          rating: tables.movies.rating,
          id: tables.movies.id,
        })
        .from(tables.movies)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(tables.movies[orderBy as keyof Movie]))
        .all();

      const total = await db
        .select({
          total: sql`count(*)`,
        })
        .from(tables.movies)
        .limit(1)
        .get();

      return {
        results: movie,
        offset: offset + limit,
        total: total.total as number,
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
    .output(
      z.object({
        results: z
          .array(
            z.object({
              title: z.string(),
              year: z.number(),
              rating: z.number(),
              id: z.number(),
            })
          )
          .optional()
          .default([]),
        offset: z.number(),
        total: z.number().optional().default(0),
      })
    )

    .mutation(async ({ ctx: { db }, input }) => {
      const { limit, offset, orderBy, query } = input;
      const movies = await db
        .select({
          title: tables.movies.title,
          year: tables.movies.year,
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

            sql`(${tables.movies.year} >= ${input.filterBy.yearGte})`,
            sql`(${tables.movies.year} <= ${input.filterBy.yearLte})`
          )
        )

        .all()
        .catch((err) => {
          console.log(err);
          return [];
        });

      const total = await db
        .select({
          total: sql`count(*)`,
        })
        .from(tables.movies)
        .limit(1)
        .where(sql`LOWER(${tables.movies.title}) LIKE LOWER(${sql`${query}`})`)
        .get();

      return {
        results: movies,
        offset: offset + limit,
        total: total.total as number,
      };
    }),
});
