package com.a2m.back.service.sys.book;

import java.util.Date;
import java.util.List;

import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.sys.book.BookTitle;

public interface Sys0201Service{
//	public void uploadEbook(MultipartFile file, String bookCode) throws IOException;
//	public Resource downloadFile(String fileName) throws Exception;
	public List<BookResponse> getBooks();
	List<BookTitle> getBooksLimit(String page, String search, 
			String category, String author, 
			int[] listCategory, String[] listAuthor, String categoryByName);

	List<BookTitle> getBooksSearch(String search, int page);
	public boolean updateBook(BookTitle book);
	public BookResponse getBookInfo(String bookCode);
	public BookTitle addBookTitle(BookTitle book, int quantity);
	public void changeStatus (String bookCode, int status);
	public void changeStatusEbook (String bookCode, String status);
	public List<BookTitle> getBookTitleByGenre(int genre_id, int page);
//	public String addBookCover(String bookCode);
//	public Resource getBookCover(String bookCode);
	public int countTotalBookTitle(String search, String category, String[] listAuthor, String author, String categoryByName);
	public List<String> getAuthor();
	public String getBookCover(String fileName);
	String getEstimateTimeHaveOfBook(String bookCode);
}
