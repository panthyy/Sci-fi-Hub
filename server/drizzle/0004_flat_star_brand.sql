CREATE TABLE `actors` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `actors_to_movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`movie_id` integer NOT NULL,
	`actor_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`),
	FOREIGN KEY (`actor_id`) REFERENCES `actors`(`id`)
);
--> statement-breakpoint
CREATE TABLE `country` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `country_to_movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`movie_id` integer NOT NULL,
	`country_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`),
	FOREIGN KEY (`country_id`) REFERENCES `country`(`id`)
);
--> statement-breakpoint
CREATE TABLE `directors` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `directors_to_movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`movie_id` integer NOT NULL,
	`director_id` integer NOT NULL,
	FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`),
	FOREIGN KEY (`director_id`) REFERENCES `directors`(`id`)
);
--> statement-breakpoint
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/