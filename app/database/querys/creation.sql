create database store_app;

use store_app;

CREATE TABLE IF NOT EXISTS users (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NULL DEFAULT NULL,
  `email` VARCHAR(70) NULL DEFAULT NULL,
  `password` VARCHAR(250) NULL DEFAULT NULL,
  `rol` ENUM('client', 'owner') NULL DEFAULT NULL,
  `city` VARCHAR(200) NULL DEFAULT NULL,
  `state` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS stores (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` INT NULL DEFAULT NULL,
  `image` TEXT NULL DEFAULT NULL,
  `descriptions` TEXT NULL DEFAULT NULL,
  `owner_id` INT NULL DEFAULT NULL,
  `likes` INT NULL DEFAULT NULL,
  `state` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS products (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` INT NULL DEFAULT NULL,
  `image` TEXT NULL DEFAULT NULL,
  `descriptions` TEXT NULL DEFAULT NULL,
  `store_id` INT NULL DEFAULT NULL,
  `likes` INT NULL DEFAULT NULL,
  `state` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (store_id) REFERENCES stores (id)
);

CREATE TABLE IF NOT EXISTS purchases (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `store_id` INT NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL,
  `total` DOUBLE NULL DEFAULT NULL,
  `state` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (store_id) REFERENCES stores (id)
);

CREATE TABLE IF NOT EXISTS purchases_details (
  `id` INT NOT NULL AUTO_INCREMENT,
  `purchase_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `amount` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (purchase_id) REFERENCES purchases (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);