package com.a2m.back.dao.sys.book;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.a2m.back.model.sys.book.ImageBook;

@Mapper
public interface Sys0204DAO {

	int countImageByBookCode(String bookCode);
	
	int addImageInBookTitle(ImageBook imageBook);

	List<ImageBook> getImagesByBookCode(String bookCode, int status);
	
	
	
	void changeStatusImageById(String id, int status);
}
