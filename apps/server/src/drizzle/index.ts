import { sql, WithEnum } from "drizzle-orm";
import {
  check,
  date,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  released: date("released").notNull(),
  description: text("description").notNull(),
  length: integer("length").notNull(),
  rating: decimal("rating").notNull(),
});

export const posters = pgTable(
  "posters",
  {
    id: serial("id").primaryKey(),
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

export const actors = pgTable("actors", {
  id: integer("id").primaryKey(),
  name: text("name"),
  profilePictureSrc: text("profile_picture_src"),
});

export const country = pgTable("country", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const directors = pgTable("directors", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const directorsToMovies = pgTable("directors_to_movies", {
  id: integer("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
  directorId: integer("director_id")
    .notNull()
    .references(() => directors.id),
});

export const countryToMovies = pgTable("country_to_movies", {
  id: integer("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
  countryId: integer("country_id")
    .notNull()
    .references(() => country.id),
});

export const actorsToMovies = pgTable("actors_to_movies", {
  id: integer("id").primaryKey(),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
  actorId: integer("actor_id")
    .notNull()
    .references(() => actors.id),
});

export const subgenres = pgTable("subgenres", {
  id: integer("id").primaryKey(),
  name: text("name"),
});

export const genres = pgTable("genres", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
});

export const users = pgTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
});

export const subgenresToMovies = pgTable("subgenres_to_movies", {
  id: integer("id").primaryKey(),
  subgenreId: integer("subgenre_id")
    .notNull()
    .references(() => subgenres.id),
  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id),
});

export const genresToMovies = pgTable("genres_to_movies", {
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
