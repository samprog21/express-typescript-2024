CREATE TABLE `products` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`image` varchar(2048),
	`price` decimal(10,2),
	`description` text,
	`quantity` bigint DEFAULT 1,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`username` varchar(256),
	`email` varchar(256),
	`first_name` varchar(256),
	`last_name` varchar(256),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
