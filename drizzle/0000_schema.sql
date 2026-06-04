CREATE TABLE `profiles` (
  `id` text PRIMARY KEY NOT NULL,
  `username` text NOT NULL,
  `display_name` text,
  `bio` text,
  `avatar_url` text,
  `default_entry_visibility` text DEFAULT 'private' NOT NULL,
  `map_theme` text DEFAULT '{}' NOT NULL,
  `created_at` integer NOT NULL
);

CREATE TABLE `trips` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `name` text NOT NULL,
  `description` text,
  `slug` text NOT NULL,
  `color` text DEFAULT '#3B82F6' NOT NULL,
  `is_public` integer DEFAULT false NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON DELETE cascade
);

CREATE TABLE `pin_categories` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `name` text NOT NULL,
  `color` text NOT NULL,
  `icon` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON DELETE cascade
);

CREATE TABLE `entries` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `trip_id` text,
  `category_id` text,
  `title` text NOT NULL,
  `content` text,
  `location_name` text,
  `lat` real NOT NULL,
  `lng` real NOT NULL,
  `country_code` text,
  `visit_date` text,
  `rating` integer,
  `is_public` integer DEFAULT false NOT NULL,
  `display_order` integer,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON DELETE cascade,
  FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE set null,
  FOREIGN KEY (`category_id`) REFERENCES `pin_categories`(`id`) ON DELETE set null
);

CREATE TABLE `tags` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `name` text NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `profiles`(`id`) ON DELETE cascade
);

CREATE TABLE `entry_tags` (
  `entry_id` text NOT NULL,
  `tag_id` text NOT NULL,
  FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON DELETE cascade,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade
);

CREATE TABLE `follows` (
  `follower_id` text NOT NULL,
  `following_id` text NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`follower_id`) REFERENCES `profiles`(`id`) ON DELETE cascade,
  FOREIGN KEY (`following_id`) REFERENCES `profiles`(`id`) ON DELETE cascade
);

-- Unique indexes
CREATE UNIQUE INDEX `profiles_username_idx` ON `profiles` (`username`);
CREATE UNIQUE INDEX `trips_user_slug_idx` ON `trips` (`user_id`, `slug`);
CREATE UNIQUE INDEX `tags_user_name_idx` ON `tags` (`user_id`, `name`);
CREATE UNIQUE INDEX `entry_tags_pk` ON `entry_tags` (`entry_id`, `tag_id`);
CREATE UNIQUE INDEX `follows_pk` ON `follows` (`follower_id`, `following_id`);

-- Performance indexes
CREATE INDEX `entries_user_id_idx` ON `entries` (`user_id`);
CREATE INDEX `entries_trip_id_idx` ON `entries` (`trip_id`);
CREATE INDEX `entries_is_public_idx` ON `entries` (`is_public`);
CREATE INDEX `follows_following_id_idx` ON `follows` (`following_id`);
