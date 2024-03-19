package com.a2m.back.service.sys.book;

import java.util.List;

import com.a2m.back.model.sys.book.ImageBook;

public interface Sys0204Service {
	
	public int countImageByBookCode(String bookCode);
	
	int addImageInBookTitle(ImageBook imageBook);
	
	List<ImageBook> getImagesByBookCode(String bookCode, int status);
	
	void changeStatusImageById(List<String> listBookId);

}
