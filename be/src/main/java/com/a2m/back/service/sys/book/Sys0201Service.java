package com.a2m.back.service.sys.book;

import java.util.Date;
import java.util.List;

import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.sys.book.BookTitle;

public interface Sys0201Service {
	public List<BookResponse> getBooksWithStatus(int size, String search, int page, int status, int type, String sort);

	public int countBooksWithStatus(int size, String search, int page, int status, int type);

	List<BookResponse> getBooksLimit(int size, String page, String search, String category, int[] listCategory,
			String[] listAuthor, String categoryByName, String[] type);

	public boolean updateBook(BookTitle book);

	public BookResponse getBookInfo(String bookCode);

	public BookTitle addBookTitle(BookTitle book, int quantity);

	public void changeStatus(String bookCode, int status);

	public void changeStatusEbook(String bookCode, String status);

	public List<BookTitle> getBookTitleByGenre(int genre_id, int page);

	public int countTotalBookTitle(String search, String category, String[] listAuthor, String categoryByName,
			String[] type);

	public List<String> getAuthor();

	public String getBookCover(String fileName);

	String getEstimateTimeHaveOfBook(String bookCode);
	
	public int addAccess(String bookCode) throws Exception;
}
