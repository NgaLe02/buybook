USE intern_back;

CREATE TABLE DAUSACH (
  BOOK_CODE VARCHAR(4) NOT NULL,
  TITLE VARCHAR(50) NOT NULL,
  PUBLISHER VARCHAR(50) NOT NULL,
  PRICE  INTEGER(10) NOT NULL,
  PAGES INTEGER(10) NOT NULL,
  DESCRIPTION VARCHAR(3000) ,
  STATUS  INTEGER(10) NOT NULL,
  AUTHOR VARCHAR(50) NOT NULL,
  CREATED_YEAR INTEGER(10) ,
  CATEGORY INTEGER(10) NOT NULL,
  PRIMARY KEY (BOOK_CODE),
  DATE_ADD datetime,
  ebook int,
  IMG VARCHAR(500)
);

CREATE TABLE WISHLIST (
USER_UID bigint not null,
BOOK_CODE VARCHAR(4) not null,
DATE_ADD date not null,
primary key (USER_UID, BOOK_CODE)
);

CREATE TABLE LOAISACH (
  GENRE_ID INTEGER(10) NOT NULL auto_increment,
  GENRE_NAME VARCHAR(50) NOT NULL,
  STATUS INTEGER(10) NOT NULL,
  PRIMARY KEY (GENRE_ID)
  );
  
CREATE TABLE LOAISACH_DAUSACH (
  BOOK_CODE VARCHAR(4) NOT NULL,
  GENRE_ID INTEGER(10) NOT NULL,
  PRIMARY KEY (BOOK_CODE, GENRE_ID),
  FOREIGN KEY (BOOK_CODE) REFERENCES DAUSACH(BOOK_CODE) ,
  FOREIGN KEY (GENRE_ID) REFERENCES LOAISACH(GENRE_ID) 
);

CREATE TABLE SACH(
  BOOK_ID VARCHAR (255) NOT NULL,
  BOOK_CODE VARCHAR (4) ,
  STATUS INTEGER(10) NOT NULL,
  FOREIGN KEY (BOOK_CODE) REFERENCES DAUSACH(BOOK_CODE) ,
  PRIMARY KEY (BOOK_ID)
);

CREATE TABLE PHIEUMUON(
  ID_PHIEU_MUON INTEGER(10) NOT NULL auto_increment,
  USER_UID BIGINT(19) NOT NULL,
  CREATED_DATE DATE NOT NULL,
  BORROW_DATE DATE,
  RETURN_DATE_ESTIMATE DATE,
  RETURN_UPDATE_REAL DATE,
  STATUS INTEGER(10) NOT NULL, 
  -- 0: đang chờ xác nhận
  -- 1: đang mượn
  -- 2: đã trả
  -- 3: đã hủy
  -- 4: trả muộn
  EXTENDED_TIMES INTEGER(10) NOT NULL,
  PRIMARY KEY(ID_PHIEU_MUON)
);	

CREATE TABLE SACHMUON (
  SACHMUON_ID  INTEGER(10) NOT NULL UNIQUE AUTO_INCREMENT,
  BOOK_ID VARCHAR(255) NOT NULL,
  ID_PHIEU_MUON INTEGER(10) NOT NULL,
  STATUS int not null,
-- 1: ko cho mượn theo  yêu cầu của bạn đọc
-- 0: đang chờ
-- 1: đang cho mượn
-- 2: sach duoc tra
-- 3: hủy phiếu
-- 4: sach bi mat
  PRIMARY KEY (BOOK_ID, ID_PHIEU_MUON),
  FOREIGN KEY (BOOK_ID) REFERENCES SACH(BOOK_ID) ,
  FOREIGN KEY (ID_PHIEU_MUON) REFERENCES PHIEUMUON(ID_PHIEU_MUON) 
);

CREATE TABLE GIOHANG(
	USER_UID BIGINT(19) NOT NULL,
    BOOK_CODE VARCHAR(4) NOT NULL,
    DATE_ADD date not null,
    PRIMARY KEY(USER_UID,BOOK_CODE),
    FOREIGN KEY (BOOK_CODE) REFERENCES DAUSACH(BOOK_CODE)
);

CREATE TABLE BASEROLE(
	ROLE_ID VARCHAR (45) NOT NULL,
    ROLE_NM VARCHAR (255),
    DESCRIPTION VARCHAR (255),
    CREATED_DATE TIMESTAMP NOT NULL,
    CREATED_BY BIGINT(19) NOT NULL,
    UPDATED_BY BIGINT(19) NOT NULL,
    UPDATED_DATE TIMESTAMP NOT NULL,
    USER_YN VARCHAR(45),
    PRIMARY KEY (ROLE_ID)
);

CREATE TABLE BASEROLE_USER(
	ROLE_ID VARCHAR(45) NOT NULL,
    USER_UID BIGINT(19) NOT NULL,
    PRIMARY KEY(ROLE_ID,USER_UID),
    FOREIGN KEY (ROLE_ID) REFERENCES BASEROLE(ROLE_ID)
);

CREATE TABLE THONGBAO(
	NOTIFICATION_ID INTEGER(10) NOT NULL auto_increment,
    CONTENT VARCHAR(255) NOT NULL,
	USER_UID BIGINT(19) NOT NULL,
    DATE_ADD date not null,
    ABOUT varchar(255) not null,
    ISREAD boolean not null,
    ID varchar(255),
    PRIMARY KEY(NOTIFICATION_ID)
);

CREATE TABLE DANHGIA(
  EVALUATE_ID INTEGER(10) NOT NULL AUTO_INCREMENT,
  USER_UID BIGINT(19) NOT NULL,
  SACHMUON_ID INTEGER(10),
  CONTENT varchar(3000),
  STAR int,
  DATE_EVALUATE date,
  PRIMARY KEY(EVALUATE_ID, SACHMUON_ID),
  FOREIGN KEY(SACHMUON_ID) REFERENCES SACHMUON(SACHMUON_ID)
);

insert into BASEROLE(ROLE_ID, ROLE_NM)
values ("R000", "ROLE_ADMIN"),
("R001", "ROLE_NORMAL");

use intern_slo;
CREATE TABLE SLO_LOGOUT(
USER_UID varchar(255),
LOGOUT_TIME bigint,
OFFSET_TIMEZONE bigint ,
PRIMARY KEY (USER_UID)
);

use library_sso;
create table USER (
USER_UID bigint,
USER_ID varchar(45),
PWD varchar(255),
STATUS varchar(255),
primary key(USER_UID)
);

CREATE TABLE USER_INFO(
USER_UID bigint,
FULL_NAME varchar(255),
GENDER bit,
DOB date,
PHONE varchar(10),
EMAIL varchar(255) unique,
ADDRESS varchar(255),
IMG_PATH varchar(255),
VERIFY_KEY varchar(255) unique,
CREATED_DATE datetime,
UPDATED_DATE datetime,
PRIMARY KEY(USERUID)
);





