//@ts-nocheck
import { tables } from "@drizzle/index";
import { drizzle } from "drizzle-orm/node-postgres";

import movies from "./movies.json";
import genres from "./genres.json";
import { Pool } from "pg";

const moviesWithoutGenresandSubgenresGen = function* () {
  for (const m of movies) {
    yield {
      title: m.title,
      year: Number(m.year),
      rating: "3.5",
      description: "",
      length: 0,
    };
  }
};

try {
  console.log(env);

  const db = drizzle(new Pool());

  // handle 500 each time
  let buffer = [];
  for (const g of moviesWithoutGenresandSubgenresGen()) {
    buffer.push(g);
    if (buffer.length === 100) {
      const resultOfInsertingMovies = await db
        .insert(tables.movies)
        .values(buffer);
      buffer = [];
    }
  }
  if (buffer.length > 0) {
    const resultOfInsertingMovies = await db
      .insert(tables.movies)
      .values(buffer);
    buffer = [];
  }

  const resultOfInsertingGenres = await db.insert(tables.genres).values(genres);

  return new Response("Hello World!");
} catch (error) {
  console.log(error);
  return new Response("Internal Server Error", {
    status: 500,
  });
}
