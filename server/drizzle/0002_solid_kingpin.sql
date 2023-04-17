CREATE TABLE `genres` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `genres_to_movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`genre_id` integer NOT NULL,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);
--> statement-breakpoint
CREATE TABLE `subgenres` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `subgenres_to_movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`subgenre_id` integer NOT NULL,
	`movie_id` integer NOT NULL,
	FOREIGN KEY (`subgenre_id`) REFERENCES `subgenres`(`id`),
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`)
);
