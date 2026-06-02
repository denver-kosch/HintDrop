-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hintdrop
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_shareable` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lists`
--

LOCK TABLES `lists` WRITE;
/*!40000 ALTER TABLE `lists` DISABLE KEYS */;
INSERT INTO `lists` VALUES (1,'Denver Birthday Wishlist','Things Denver wants for birthday',1,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(2,'Private Tech Upgrades','Personal hardware planning',0,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(3,'Alice Wedding Ideas','Wedding registry and ideas',1,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(4,'Bob Gaming Setup','Streaming and gaming gear',1,'2026-05-21 10:06:18','2026-05-21 10:06:18');
/*!40000 ALTER TABLE `lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_lists`
--
--
-- Table structure for table `userlists`
--

DROP TABLE IF EXISTS `userlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `list_id` int NOT NULL,
  `role` enum('owner','editor','viewer') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'viewer',
  `last_opened_at` datetime DEFAULT NULL,
  `pinned_at` datetime DEFAULT NULL,
  `archived_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userlists_user_id_list_id_unique` (`user_id`,`list_id`),
  KEY `userlists_list_id_index` (`list_id`),
  KEY `userlists_recent_index` (`user_id`,`archived_at`,`pinned_at`,`last_opened_at`),
  CONSTRAINT `userlists_list_id_foreign` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userlists_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userlists`
--

LOCK TABLES `userlists` WRITE;
/*!40000 ALTER TABLE `userlists` DISABLE KEYS */;
INSERT INTO `userlists` VALUES (1,1,1,'owner','2026-05-21 10:06:18','2026-05-21 10:06:18',NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(2,1,2,'owner','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(3,2,3,'owner','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(4,3,4,'owner','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(5,2,1,'viewer','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(6,3,1,'editor','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(7,4,1,'viewer','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(8,1,3,'editor','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(9,4,3,'viewer','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(10,1,4,'viewer','2026-05-21 10:06:18',NULL,NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18');
/*!40000 ALTER TABLE `userlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_num` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_phone_num_unique` (`phone_num`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'denver','$2b$10$8I0xW7cqO/2I..SnsxsQLeRBIfD2xrD.UhSmmhSG8tIPYlmM8SFsy','Denver','Kosch','dkosch2@gmail.com','+17402437103',1,1,'2026-05-21 10:06:18','2026-05-27 02:29:12'),(2,'alice','$2b$10$8I0xW7cqO/2I..SnsxsQLeRBIfD2xrD.UhSmmhSG8tIPYlmM8SFsy','Alice','Johnson','alice@example.com','6145551002',1,0,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(3,'bob','$2b$10$8I0xW7cqO/2I..SnsxsQLeRBIfD2xrD.UhSmmhSG8tIPYlmM8SFsy','Bob','Williams','bob@example.com','6145551003',1,0,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(4,'carol','$2b$10$8I0xW7cqO/2I..SnsxsQLeRBIfD2xrD.UhSmmhSG8tIPYlmM8SFsy','Carol','Davis','carol@example.com','6145551004',1,0,'2026-05-21 10:06:18','2026-05-21 10:06:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificationtokens`
--

DROP TABLE IF EXISTS `verificationtokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificationtokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `method` enum('email','sms') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `verificationtokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificationtokens`
--

LOCK TABLES `verificationtokens` WRITE;
/*!40000 ALTER TABLE `verificationtokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `verificationtokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-28 21:56:52


--
-- Table structure for table `gifts`
--

DROP TABLE IF EXISTS `gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `list_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `priority` enum('low','medium','high') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reserved_by_user_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `gifts_list_id_index` (`list_id`),
  KEY `gifts_reserved_by_user_id_index` (`reserved_by_user_id`),
  CONSTRAINT `gifts_list_id_foreign` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gifts_reserved_by_user_id_foreign` FOREIGN KEY (`reserved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `gifts_quantity_check` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gifts`
--

LOCK TABLES `gifts` WRITE;
/*!40000 ALTER TABLE `gifts` DISABLE KEYS */;
INSERT INTO `gifts` VALUES (1,1,'Sony WH-1000XM5 Headphones','Noise cancelling headphones',349.99,'https://www.amazon.com/',NULL,1,'high',2,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(2,1,'Steam Gift Card','Wallet funds for games',50.00,NULL,NULL,2,'medium',NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(3,2,'RTX 5070','GPU upgrade for gaming PC',699.99,NULL,NULL,1,'high',NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(4,3,'Wedding Venue Decorations','Decor inspiration pieces',200.00,NULL,NULL,1,'medium',1,'2026-05-21 10:06:18','2026-05-21 10:06:18'),(5,4,'Elgato Stream Deck','Streaming control pad',149.99,NULL,NULL,1,'low',NULL,'2026-05-21 10:06:18','2026-05-21 10:06:18');
/*!40000 ALTER TABLE `gifts` ENABLE KEYS */;
UNLOCK TABLES;
