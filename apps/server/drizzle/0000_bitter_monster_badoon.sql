CREATE TABLE IF NOT EXISTS "actors" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text,
	"profile_picture_src" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "actors_to_movies" (
	"id" integer PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"actor_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "country" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "country_to_movies" (
	"id" integer PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"country_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "directors" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "directors_to_movies" (
	"id" integer PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"director_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres_to_movies" (
	"id" integer PRIMARY KEY NOT NULL,
	"genre_id" integer NOT NULL,
	"movie_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"released" date NOT NULL,
	"description" text NOT NULL,
	"length" integer NOT NULL,
	"rating" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posters" (
	"id" serial PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"src" text NOT NULL,
	"size" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subgenres" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subgenres_to_movies" (
	"id" integer PRIMARY KEY NOT NULL,
	"subgenre_id" integer NOT NULL,
	"movie_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"password" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "actors_to_movies" ADD CONSTRAINT "actors_to_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "actors_to_movies" ADD CONSTRAINT "actors_to_movies_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "actors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "country_to_movies" ADD CONSTRAINT "country_to_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "country_to_movies" ADD CONSTRAINT "country_to_movies_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "directors_to_movies" ADD CONSTRAINT "directors_to_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "directors_to_movies" ADD CONSTRAINT "directors_to_movies_director_id_directors_id_fk" FOREIGN KEY ("director_id") REFERENCES "directors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genres_to_movies" ADD CONSTRAINT "genres_to_movies_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "genres_to_movies" ADD CONSTRAINT "genres_to_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posters" ADD CONSTRAINT "posters_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subgenres_to_movies" ADD CONSTRAINT "subgenres_to_movies_subgenre_id_subgenres_id_fk" FOREIGN KEY ("subgenre_id") REFERENCES "subgenres"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subgenres_to_movies" ADD CONSTRAINT "subgenres_to_movies_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
