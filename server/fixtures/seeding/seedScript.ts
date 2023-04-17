import { tables } from "@drizzle/*";
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import movies from "./movies.json";
import genres from "./genres.json";

export type ENV = {
  NODE_ENV: "development" | "production";
  kv: KVNamespace;
  d1: D1Database;
};

const moviesWithoutGenresandSubgenresGen = function* () {
  for (const m of movies) {
    yield {
      title: m.title,
      year: Number(m.year),
      rating: 0,
      description: "",
      length: 0,
    };
  }
};

export default {
  async fetch(
    request: Request,
    env: ENV,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      console.log(env);

      const db = drizzle(env.d1);

      // handle 500 each time
      let buffer = [];
      for (const g of moviesWithoutGenresandSubgenresGen()) {
        buffer.push(g);
        if (buffer.length === 100) {
          const resultOfInsertingMovies = await db
            .insert(tables.movies)
            .values(buffer)
            .run();
          buffer = [];
        }
      }
      if (buffer.length > 0) {
        const resultOfInsertingMovies = await db
          .insert(tables.movies)
          .values(buffer)
          .run();
        buffer = [];
      }

      const resultOfInsertingGenres = await db
        .insert(tables.genres)
        .values(genres)
        .run();

      return new Response("Hello World!");
    } catch (error) {
      console.log(error);
      return new Response("Internal Server Error", {
        status: 500,
      });
    }
  },
};
