package com.a2m.back.dao.sys.book;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.sys.book.BookTitle;
@Mapper
public interface Sys0201DAO{
	List<BookResponse> getBooks();
	List<BookTitle> getBooksLimit(int ignore, String search, 
			String category, String[] authorList, 
			String author, String categoryByName);
	List<BookTitle> getBooksSearch(String search, int ignore);
	void updateBook(BookTitle book);
	int checkBookExist(BookTitle book);
	BookResponse getBookInfo(String bookCode);
	void addBookTitle(BookTitle book);
	void changeStatus(BookTitle book);
	void addBookGenre(@Param("bookCode")String bookCode,@Param("genre_id") String genre_id);
	List<BookTitle> getBookTitleByGenre(int genre_id, int ignore);
	void addCover(String imgFileName, String bookCode);
	int countTotalBookTitle(String search, String category, String[] authorList, String author, String categoryByName);
	List<String> getAuthor();
	void deleteBookGenre(String bookCode);
	int countBooksAvailable(String bookCode);
	void changeStatusEbook (String bookCode, String status);
	void addEbook(String filename);
}

