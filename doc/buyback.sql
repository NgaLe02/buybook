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


-- Dumping database structure for library_back
DROP DATABASE IF EXISTS `library_back`;
CREATE DATABASE IF NOT EXISTS `library_back` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `library_back`;

-- Dumping structure for table library_back.ANH_DAUSACH
DROP TABLE IF EXISTS `ANH_DAUSACH`;
CREATE TABLE IF NOT EXISTS `ANH_DAUSACH` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `BOOK_CODE` varchar(8) DEFAULT NULL,
  `PATH` varchar(50) NOT NULL,
  `STATUS` int(11) NOT NULL,
  `ABOUT` int(11) NOT NULL,
  `EVALUATE_ID` varchar(45) DEFAULT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ID`),
  KEY `anh_dausach_ibfk_1` (`BOOK_CODE`),
  CONSTRAINT `anh_dausach_ibfk_1` FOREIGN KEY (`BOOK_CODE`) REFERENCES `DAUSACH` (`BOOK_CODE`)
) ENGINE=InnoDB AUTO_INCREMENT=195 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.BASEROLE
DROP TABLE IF EXISTS `BASEROLE`;
CREATE TABLE IF NOT EXISTS `BASEROLE` (
  `ROLE_ID` varchar(45) NOT NULL,
  `ROLE_NM` varchar(255) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `CREATED_DATE` timestamp NULL DEFAULT NULL,
  `CREATED_BY` bigint(20) DEFAULT NULL,
  `UPDATED_BY` bigint(20) DEFAULT NULL,
  `UPDATED_DATE` timestamp NULL DEFAULT NULL,
  `USER_YN` varchar(45) DEFAULT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ROLE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.BASE_USER_ROLE
DROP TABLE IF EXISTS `BASE_USER_ROLE`;
CREATE TABLE IF NOT EXISTS `BASE_USER_ROLE` (
  `ROLE_ID` varchar(45) NOT NULL,
  `USER_UID` bigint(20) NOT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ROLE_ID`,`USER_UID`),
  CONSTRAINT `base_user_role_ibfk_1` FOREIGN KEY (`ROLE_ID`) REFERENCES `BASEROLE` (`ROLE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.DANHGIA
DROP TABLE IF EXISTS `DANHGIA`;
CREATE TABLE IF NOT EXISTS `DANHGIA` (
  `EVALUATE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `USER_UID` bigint(20) NOT NULL,
  `SACHMUON_ID` varchar(100) NOT NULL,
  `CONTENT` varchar(3000) DEFAULT NULL,
  `STAR` int(11) DEFAULT NULL,
  `DATE_EVALUATE` date DEFAULT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`EVALUATE_ID`,`SACHMUON_ID`),
  UNIQUE KEY `SACHMUON_ID_UNIQUE` (`SACHMUON_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.DAUSACH
DROP TABLE IF EXISTS `DAUSACH`;
CREATE TABLE IF NOT EXISTS `DAUSACH` (
  `BOOK_CODE` varchar(10) NOT NULL,
  `TITLE` varchar(100) NOT NULL,
  `PUBLISHER` varchar(50) NOT NULL,
  `PRICE` int(11) NOT NULL,
  `PAGES` int(11) NOT NULL,
  `DESCRIPTION` varchar(6000) DEFAULT NULL,
  `STATUS` int(11) NOT NULL,
  `AUTHOR` varchar(500) NOT NULL,
  `CREATED_YEAR` int(11) DEFAULT NULL,
  `CATEGORY` int(11) NOT NULL,
  `DATE_ADD` datetime DEFAULT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `EBOOK` tinyint(4) NOT NULL,
  PRIMARY KEY (`BOOK_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.GIOHANG
DROP TABLE IF EXISTS `GIOHANG`;
CREATE TABLE IF NOT EXISTS `GIOHANG` (
  `USER_UID` bigint(20) NOT NULL,
  `BOOK_CODE` varchar(8) NOT NULL,
  `DATE_ADD` timestamp NOT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`USER_UID`,`BOOK_CODE`),
  KEY `BOOK_CODE` (`BOOK_CODE`),
  CONSTRAINT `giohang_ibfk_1` FOREIGN KEY (`BOOK_CODE`) REFERENCES `DAUSACH` (`BOOK_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.LOAISACH
DROP TABLE IF EXISTS `LOAISACH`;
CREATE TABLE IF NOT EXISTS `LOAISACH` (
  `GENRE_ID` int(11) NOT NULL AUTO_INCREMENT,
  `GENRE_NAME` varchar(50) NOT NULL,
  `DATE_ADD` datetime DEFAULT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`GENRE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.LOAISACH_DAUSACH
DROP TABLE IF EXISTS `LOAISACH_DAUSACH`;
CREATE TABLE IF NOT EXISTS `LOAISACH_DAUSACH` (
  `BOOK_CODE` varchar(8) NOT NULL,
  `GENRE_ID` int(11) NOT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`BOOK_CODE`,`GENRE_ID`),
  KEY `GENRE_ID` (`GENRE_ID`),
  CONSTRAINT `loaisach_dausach_ibfk_1` FOREIGN KEY (`BOOK_CODE`) REFERENCES `DAUSACH` (`BOOK_CODE`),
  CONSTRAINT `loaisach_dausach_ibfk_2` FOREIGN KEY (`GENRE_ID`) REFERENCES `LOAISACH` (`GENRE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.PHIEUMUON
DROP TABLE IF EXISTS `PHIEUMUON`;
CREATE TABLE IF NOT EXISTS `PHIEUMUON` (
  `id_phieu_muon` int(11) NOT NULL AUTO_INCREMENT,
  `USER_UID` bigint(20) NOT NULL,
  `CREATED_DATE` date NOT NULL,
  `BORROW_DATE` date DEFAULT NULL,
  `RETURN_DATE_ESTIMATE` date DEFAULT NULL,
  `RETURN_UPDATE_REAL` date DEFAULT NULL,
  `STATUS` int(11) NOT NULL,
  `EXTENDED_TIMES` int(11) NOT NULL,
  `FINE` int(11) DEFAULT NULL,
  `CANCEL_DATE` date DEFAULT NULL,
  `BORROW_DATE_REAL` date DEFAULT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_phieu_muon`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.SACH
DROP TABLE IF EXISTS `SACH`;
CREATE TABLE IF NOT EXISTS `SACH` (
  `BOOK_ID` varchar(255) NOT NULL,
  `BOOK_CODE` varchar(8) DEFAULT NULL,
  `STATUS` int(11) NOT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`BOOK_ID`),
  KEY `sach_ibfk_1` (`BOOK_CODE`),
  CONSTRAINT `sach_ibfk_1` FOREIGN KEY (`BOOK_CODE`) REFERENCES `DAUSACH` (`BOOK_CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.SACHMUON
DROP TABLE IF EXISTS `SACHMUON`;
CREATE TABLE IF NOT EXISTS `SACHMUON` (
  `BOOK_ID` varchar(255) NOT NULL,
  `ID_PHIEU_MUON` int(11) NOT NULL,
  `STATUS` int(11) NOT NULL,
  `REQUIRED` int(11) DEFAULT NULL,
  `SACHMUON_ID` int(11) NOT NULL AUTO_INCREMENT,
  `EVALUATE` int(11) NOT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`BOOK_ID`,`ID_PHIEU_MUON`),
  UNIQUE KEY `SACHMUON_ID_UNIQUE` (`SACHMUON_ID`),
  KEY `ID_PHIEU_MUON` (`ID_PHIEU_MUON`),
  CONSTRAINT `sachmuon_ibfk_1` FOREIGN KEY (`BOOK_ID`) REFERENCES `SACH` (`BOOK_ID`),
  CONSTRAINT `sachmuon_ibfk_2` FOREIGN KEY (`ID_PHIEU_MUON`) REFERENCES `PHIEUMUON` (`id_phieu_muon`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.THONGBAO
DROP TABLE IF EXISTS `THONGBAO`;
CREATE TABLE IF NOT EXISTS `THONGBAO` (
  `NOTIFICATION_ID` int(11) NOT NULL AUTO_INCREMENT,
  `CONTENT` varchar(255) NOT NULL,
  `USER_UID` bigint(20) NOT NULL,
  `DATE_ADD` date NOT NULL,
  `ABOUT` varchar(255) NOT NULL,
  `ISREAD` tinyint(1) NOT NULL,
  `ID` varchar(45) DEFAULT NULL,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`NOTIFICATION_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.TRUYCAP_EBOOK
DROP TABLE IF EXISTS `TRUYCAP_EBOOK`;
CREATE TABLE IF NOT EXISTS `TRUYCAP_EBOOK` (
  `BOOK_CODE` varchar(10) NOT NULL,
  `USER_UID` bigint(20) NOT NULL DEFAULT 0,
  `COUNT` bigint(20) DEFAULT 0,
  PRIMARY KEY (`BOOK_CODE`,`USER_UID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Data exporting was unselected.

-- Dumping structure for table library_back.WISHLIST
DROP TABLE IF EXISTS `WISHLIST`;
CREATE TABLE IF NOT EXISTS `WISHLIST` (
  `USER_UID` bigint(20) NOT NULL,
  `BOOK_CODE` varchar(8) NOT NULL,
  `DATE_ADD` date NOT NULL,
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `modification_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`USER_UID`,`BOOK_CODE`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
