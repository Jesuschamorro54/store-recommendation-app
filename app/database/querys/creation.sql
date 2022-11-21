-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema store_app
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema store_app
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `store_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `store_app` ;

-- -----------------------------------------------------
-- Table `store_app`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_app`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(200) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `password` VARCHAR(250) NULL DEFAULT NULL,
  `role` ENUM('client', 'owner') NULL DEFAULT NULL,
  `city` VARCHAR(200) NULL DEFAULT NULL,
  `state` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_app`.`stores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_app`.`stores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `image` TEXT NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `owner_id` INT NULL DEFAULT NULL,
  `likes` INT NULL DEFAULT '0',
  `state` INT NULL DEFAULT '0',
  `lat` TEXT NULL DEFAULT NULL,
  `lng` TEXT NULL DEFAULT NULL,
  `address` TEXT NULL DEFAULT NULL,
  `total_sales` INT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `stores_ibfk_1` (`owner_id` ASC) VISIBLE,
  CONSTRAINT `stores_ibfk_1`
    FOREIGN KEY (`owner_id`)
    REFERENCES `store_app`.`users` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_app`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_app`.`products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `image` TEXT NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `store_id` INT NULL DEFAULT NULL,
  `likes` INT NULL DEFAULT '0',
  `state` INT NULL DEFAULT '0',
  `price` DOUBLE NULL DEFAULT '0',
  `promotion` VARCHAR(100) NULL DEFAULT NULL,
  `old_price` DOUBLE NULL DEFAULT '0',
  `available` INT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  CONSTRAINT `products_ibfk_1`
    FOREIGN KEY (`store_id`)
    REFERENCES `store_app`.`stores` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_app`.`purchases`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_app`.`purchases` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `store_id` INT NULL DEFAULT NULL,
  `fecha` DATETIME NULL DEFAULT NULL,
  `total` DOUBLE NULL DEFAULT NULL,
  `state` INT NULL DEFAULT '0',
  `address` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `store_id` (`store_id` ASC) VISIBLE,
  CONSTRAINT `purchases_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `store_app`.`users` (`id`),
  CONSTRAINT `purchases_ibfk_2`
    FOREIGN KEY (`store_id`)
    REFERENCES `store_app`.`stores` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `store_app`.`purchases_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `store_app`.`purchases_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `purchase_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `amount` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `purchase_id` (`purchase_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `purchases_details_ibfk_1`
    FOREIGN KEY (`purchase_id`)
    REFERENCES `store_app`.`purchases` (`id`),
  CONSTRAINT `purchases_details_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `store_app`.`products` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
