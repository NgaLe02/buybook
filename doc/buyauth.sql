-- --------------------------------------------------------
-- Host:                         192.168.0.106
-- Server version:               11.0.4-MariaDB - MariaDB Server
-- Server OS:                    Linux
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for library_sso
DROP DATABASE IF EXISTS `library_sso`;
CREATE DATABASE IF NOT EXISTS `library_sso` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `library_sso`;

-- Dumping structure for table library_sso.USER
DROP TABLE IF EXISTS `USER`;
CREATE TABLE IF NOT EXISTS `USER` (
  `USER_UID` bigint(20) NOT NULL,
  `USER_ID` varchar(255) DEFAULT NULL,
  `PWD` varchar(255) DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`USER_UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping data for table library_sso.USER: ~7 rows (approximately)
INSERT INTO `USER` (`USER_UID`, `USER_ID`, `PWD`, `STATUS`) VALUES
	(20230914062250065, 'admin', '$2a$10$3kgftW7hgIpbpsirK1O7HOOQ5EVWv2aq38lt6A2GK5WHN5C4n6CzK', '02-03'),
	(20230914062807871, 'nga', '$2a$10$08Ch5myhdHLVLDF5nlfPPu67sFRnTZ9zTj0zyniWIHwazC58zPLh.', '02-03'),
	(20230918062007038, 'dat', '$2a$10$hgWrS..DYoCdykpk/wIB4eHBbTNre2VdbQB24Tpkg1hG.SF3WS7RK', '02-03'),
	(20231025032146191, 'ngoc', '$2a$10$E7eWOSyX/.Sc2oRxphNJ9OSlvEzxwZy5Pg/0RxIH7Y7.AsuYnX31S', '02-03'),
	(20231025033519619, 'tien', '$2a$10$zOeT4sD0Y7qn6EQCS4RaBOSyJvzjmBt8BKVyExd9gtMXfi1oVem.a', '02-03'),
	(20231025033627406, 'tam', '$2a$10$rnChCnqW99I0OgMTCrfHXuojDBuV2uwJC9A5aUtziXaexjCpE5afW', '02-04'),
	(20231102070303327, 'namtv95.it', '$2a$10$OAjYq235PfeG3CW8fOERUOAprH6RprL5Pyre726IlurtA.EwO79J6', '02-04');

-- Dumping structure for table library_sso.USER_INFO
DROP TABLE IF EXISTS `USER_INFO`;
CREATE TABLE IF NOT EXISTS `USER_INFO` (
  `USER_UID` bigint(20) NOT NULL,
  `FULL_NAME` varchar(255) DEFAULT NULL,
  `GENDER` bit(1) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `PHONE` varchar(10) DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `IMG_PATH` varchar(255) DEFAULT NULL,
  `VERIFY_KEY` varchar(255) DEFAULT NULL,
  `CREATED_DATE` datetime DEFAULT NULL,
  `UPDATED_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`USER_UID`),
  UNIQUE KEY `EMAIL` (`EMAIL`),
  UNIQUE KEY `VERIFY_KEY` (`VERIFY_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Dumping data for table library_sso.USER_INFO: ~7 rows (approximately)
INSERT INTO `USER_INFO` (`USER_UID`, `FULL_NAME`, `GENDER`, `DOB`, `PHONE`, `EMAIL`, `ADDRESS`, `IMG_PATH`, `VERIFY_KEY`, `CREATED_DATE`, `UPDATED_DATE`) VALUES
	(20230914062250065, 'admin', b'0', '2002-06-25', '0833250603', 'admin@gmail.com', 'thanh hoa', '20230914062250065.jpg', 'd1c6a6d0-dd20-4411-b78d-34fd4ad08b14', '2020-06-25 00:00:00', '2023-10-26 11:14:55'),
	(20230914062807871, 'nga', b'0', '2002-06-25', '0833250603', 'nga@gmail.com', '', '20230914062807871.jpg', '0597ee8e-6c1a-4eb9-addd-20ac98a0c143', '2020-06-25 00:00:00', '2023-10-26 08:54:23'),
	(20230918062007038, 'dat', b'0', '2002-06-25', '0833250605', 'dat@gmail.com', '', '20230918062007038.jpg', '3225d7af-c49d-41c2-88c5-67fdd0215616', '2020-06-25 00:00:00', '2023-10-26 08:54:59'),
	(20231025032146191, 'ngoc', b'0', '2002-06-25', '', 'ngoc@gmail.com', '', '', '46fb28c1-b1f9-4166-bb7a-9850a443c9c2', '2020-06-25 00:00:00', '2022-06-25 00:00:00'),
	(20231025033519619, 'tien', b'0', '2002-06-25', '0833250605', 'tien@gmail.com', '', '20231025033519619.jpg', '04d4e832-3266-465a-9281-9382d51bbc32', '2020-06-25 00:00:00', '2023-10-26 08:55:50'),
	(20231025033627406, 'tam', b'0', '2002-06-25', '', 'tam@gmail.com', '', '', '1294d5af-c0f3-49af-b473-b71ce21077cd', '2020-06-25 00:00:00', '2022-06-25 00:00:00'),
	(20231102070303327, 'Tạ Nam', b'0', '2002-06-25', '', 'namtv95.it@gmail.com', '', '', 'd9ce8619-e293-429e-b054-1ce7147218f1', '2020-06-25 00:00:00', '2022-06-25 00:00:00');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
