import { sql, WithEnum } from "drizzle-orm";
import {
  Check,
  check,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const movies = sqliteTable("movies", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  description: text("description").notNull(),
  length: integer("length").notNull(),
  rating: integer("rating").notNull(),
});

export const posters = sqliteTable(
  "posters",
  {
    id: integer("id").primaryKey(),
    movieId: integer("movie_id")
      .notNull()
      .references(() => movies.id),
    src: text("src").notNull(),
    size: text("size").notNull(),
    type: text("type").notNull(),
  },
  (posters) => ({
    typeCheck: check("type", sql`type IN ('poster', 'backdrop')`),
    sizeCheck: check("size", sql`size IN ('small', 'medium', 'large')`),
  })
);

export const actors = sqliteTable("actors", {
  id: integer("id").primaryKey(),
  name: text("name"),
  profilePictureSrc: text("profile_picture_src"),
});

export const country = sqliteTable("country", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const directors = sqliteTable("directors", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const directorsToMovies = sqliteTable("directors_to_movies", {
  id: integer("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
  directorId: integer("director_id")
    .notNull()
    .references(() => directors.id),
});

export const countryToMovies = sqliteTable("country_to_movies", {
  id: integer("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
  countryId: integer("country_id")
    .notNull()
    .references(() => country.id),
});

export const actorsToMovies = sqliteTable("actors_to_movies", {
  id: integer("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
  actorId: integer("actor_id")
    .notNull()
    .references(() => actors.id),
});

export const subgenres = sqliteTable("subgenres", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const genres = sqliteTable("genres", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
});

export const subgenresToMovies = sqliteTable("subgenres_to_movies", {
  id: integer("id").primaryKey(),
  subgenreId: integer("subgenre_id")
    .notNull()
    .references(() => subgenres.id),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
});

export const genresToMovies = sqliteTable("genres_to_movies", {
  id: integer("id").primaryKey(),
  genreId: integer("genre_id")
    .notNull()
    .references(() => genres.id),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
});

export const tables = {
  movies,
  subgenres,
  subgenresToMovies,
  genresToMovies,
  genres,
  actors,
  actorsToMovies,
  country,
  countryToMovies,
  directors,
  directorsToMovies,
  posters,
};
