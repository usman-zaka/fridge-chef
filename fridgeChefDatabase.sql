-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: fridgeChef
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fridge_ingredients`
--

DROP TABLE IF EXISTS `fridge_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fridge_ingredients` (
  `ingredient_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ingredient_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fridge_ingredients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fridge_ingredients`
--

LOCK TABLES `fridge_ingredients` WRITE;
/*!40000 ALTER TABLE `fridge_ingredients` DISABLE KEYS */;
INSERT INTO `fridge_ingredients` VALUES (1,1,'cat',2.00,NULL,'2025-06-07 06:31:41'),(2,1,'eggs',4.00,NULL,'2025-06-07 06:31:54'),(3,1,'corn syrup',1.00,NULL,'2025-06-10 04:29:31'),(4,1,'cornstarch',1.00,NULL,'2025-06-10 04:29:31'),(5,1,'egg white',1.00,NULL,'2025-06-10 04:29:31'),(6,1,'brush pastry rounds',1.00,NULL,'2025-06-10 04:29:31'),(7,1,'fruit',1.00,NULL,'2025-06-10 04:29:31'),(8,1,'carton lemon yogurt',1.00,NULL,'2025-06-10 04:29:31'),(9,1,'orange juice',1.00,NULL,'2025-06-10 04:29:31'),(10,1,'puff pastry',1.00,NULL,'2025-06-10 04:29:31'),(11,1,'in a mixing bowl stir together yogurt and pudding',1.00,NULL,'2025-06-10 04:29:31'),(12,1,'bake in a degree oven',1.00,NULL,'2025-06-10 04:29:31'),(13,1,'servings',1.00,NULL,'2025-06-10 04:29:31'),(14,1,'servings',1.00,NULL,'2025-06-10 04:29:31'),(15,1,'zucchini',1.00,NULL,'2025-06-10 04:30:10'),(16,1,'olive oil',1.00,NULL,'2025-06-10 04:30:11'),(17,1,'garlic',1.00,NULL,'2025-06-10 04:30:11'),(18,1,'grape tomatoes',1.00,NULL,'2025-06-10 04:30:11'),(19,1,'bread crumbs',1.00,NULL,'2025-06-10 04:30:11'),(20,1,'mozzarella cheese',1.00,NULL,'2025-06-10 04:30:11'),(21,1,'basil',1.00,NULL,'2025-06-10 04:30:11'),(22,1,'parmesan cheese',1.00,NULL,'2025-06-10 04:30:11'),(23,1,'salt and pepper',1.00,NULL,'2025-06-10 04:30:11'),(24,2,'eggs',2.00,NULL,'2025-06-10 14:26:20');
/*!40000 ALTER TABLE `fridge_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `local_recipes`
--

DROP TABLE IF EXISTS `local_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `local_recipes` (
  `recipe_id` int NOT NULL,
  `recipe_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `local_recipes`
--

LOCK TABLES `local_recipes` WRITE;
/*!40000 ALTER TABLE `local_recipes` DISABLE KEYS */;
/*!40000 ALTER TABLE `local_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` varchar(250) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`recipe_id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `local_recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_reciepes`
--

DROP TABLE IF EXISTS `saved_reciepes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_reciepes` (
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`recipe_id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `saved_reciepes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `saved_reciepes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `local_recipes` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_reciepes`
--

LOCK TABLES `saved_reciepes` WRITE;
/*!40000 ALTER TABLE `saved_reciepes` DISABLE KEYS */;
/*!40000 ALTER TABLE `saved_reciepes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_recipes`
--

DROP TABLE IF EXISTS `saved_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_recipes` (
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `recipe_title` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `saved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`recipe_id`),
  CONSTRAINT `saved_recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_recipes`
--

LOCK TABLES `saved_recipes` WRITE;
/*!40000 ALTER TABLE `saved_recipes` DISABLE KEYS */;
INSERT INTO `saved_recipes` VALUES (1,651994,'Miniature Fruit Tarts','https://img.spoonacular.com/recipes/651994-556x370.jpg','2025-06-07 06:33:29');
/*!40000 ALTER TABLE `saved_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) DEFAULT NULL,
  `family_name` varchar(20) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(300) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,NULL,'seb\'s test','$argon2id$v=19$m=65536,t=3,p=4$vaW2BqaVCzqMktQ4J14eFg$ZjwL9eZGpVd9Dnq4u4/M85SHL3VO7Ou4fiDSqdGCZBs','test3@gmail.com','images/museum theft.jpeg',0),(2,NULL,NULL,'Admin','$argon2id$v=19$m=65536,t=3,p=4$pghoLdOqr/CDsSN8zzga9Q$R3fFBlIrFYfcOsucfWDUlZNASQblc+QR5Fx3IjPyLOE','admin@gmail.com',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11  1:53:09
