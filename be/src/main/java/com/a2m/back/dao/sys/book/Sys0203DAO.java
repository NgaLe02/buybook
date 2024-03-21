package com.a2m.back.dao.sys.book;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.a2m.back.model.sys.book.Book;
import com.a2m.back.model.sys.phieumuon.BorrowedBooksDto;
@Mapper
public interface Sys0203DAO{
	List<Book> getBooks();
	String getExistBook(String bookCode);
	int getBookNumber(String bookCode);
	void addBook(String bookId, String bookCode);
	List<Book> getBooksByBookCode(String bookCode);
	void changeBookStatus(Book book);
	void changeBookStatusByBookCode(Book book);
	void changeStatusBookBorrowed(int status, int idPhieuMuon, String  bookId);

	int getBookAvailableNumber(String bookCode);
	int checkBookAvailable(String bookId);
	int getBookWithStatus(String bookCode, int status);
	List<BorrowedBooksDto> getBorrowedBookByBookCode(String bookCode, int status);
	boolean checkBorrowedBookByBookIdWithStatus(String bookId, int status);
}

