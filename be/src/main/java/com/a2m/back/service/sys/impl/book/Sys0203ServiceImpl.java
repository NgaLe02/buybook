package com.a2m.back.service.sys.impl.book;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.dao.sys.book.Sys0201DAO;
import com.a2m.back.dao.sys.book.Sys0203DAO;
import com.a2m.back.model.sys.book.Book;
import com.a2m.back.model.sys.book.BookTitle;
import com.a2m.back.service.sys.book.Sys0203Service;
@Service
public class Sys0203ServiceImpl implements Sys0203Service{
	
	@Autowired
	Sys0203DAO sys0203DAO;
	
	@Autowired
	Sys0201DAO sys0201DAO;
	
	@Override
	public List<Book> getBooks(){
		List<Book> books = new ArrayList<Book>();
		books = sys0203DAO.getBooks();
		return books;
	}
	@Override
	public String checkBookExists(String bookCode) {
		String bookId = sys0203DAO.getExistBook(bookCode);
		return bookId;
	}
	@Override
	public void addBooksByBookCode(String bookCode, int quantity) {
		int existed = sys0203DAO.getBookNumber(bookCode);
		for (int i = existed + 1; i <= existed + quantity; i++) {
			sys0203DAO.addBook(bookCode + String.format("%04d", i), bookCode);
		}
	}
	@Override
	public List<Book> getBooksByBookCode(String bookCode){
		List<Book> books = new ArrayList<Book>();
		books = sys0203DAO.getBooksByBookCode(bookCode);
		for (int i = 0; i < books.size(); i++) {
			if(sys0203DAO.checkBorrowedBookByBookIdWithStatus(books.get(i).getBookId(), 0)) {
				books.get(i).setIsAvailable(0);
			}
			else if(sys0203DAO.checkBorrowedBookByBookIdWithStatus(books.get(i).getBookId(), 1)) {
				books.get(i).setIsAvailable(1);
			}
			else {
				books.get(i).setIsAvailable(2);
			}
			
//			books.get(i).setIsAvailable(sys0203DAO.checkBookAvailable(books.get(i).getBookId()));
//			System.out.println(books.get(i).getBookId() + " " + books.get(i).getIsAvailable());
		}
		return books;
	}
	@Override
	public void changeBookStatus(String bookId, int status) {
//		4TH:
//			TH1: status  đang là 0 hết, khi có 1 quyển sách thành 1 thì đầu sách cũng thành 1
//			=> countBookStatusBeforeChange  (quyển sách bằng 1)  = 0 thì thay đổi đầu sách thành 1
//			TH2: status  đang là 1 hết, khi có 1 quyển sách thành 0 thì đầu sách vẫn là 0
//			TH3: có n quyển sách đang là 0, 1 quyển là 1, đầu sách đang là  1, quyển sách đó thành 0 => đầu sách thành 0
//			=> countBookStatusAfterChange (quyển sách bằng 1)  = 0  đầu sách thành 0
//			TH4: có n quyển sách đang là 1, 1 quyển là 0, đầu sách đang là  1, quyển sách đó thành 1 => đầu sách thành 1

		String bookCode = bookId.substring(0, 8);
		int countBookStatusBeforeChange = 0;
		if(status == 1) {
			countBookStatusBeforeChange = sys0203DAO.getBookWithStatus(bookCode, status);
			if(countBookStatusBeforeChange == 0) {
				BookTitle bookTitle = new BookTitle();
				bookTitle.setBookCode(bookCode);
				bookTitle.setStatus(status);
				sys0201DAO.changeStatus(bookTitle);
			}
		}	
		Book book = new Book();
		book.setBookId(bookId);
		book.setStatus(status);
		sys0203DAO.changeBookStatus(book);
		int countBookStatusAfterChange =  0;
		if(status == 0) {
			countBookStatusAfterChange = sys0203DAO.getBookWithStatus(bookCode, 1);
			if(countBookStatusAfterChange  == 0) {
				BookTitle bookTitle = new BookTitle();
				bookTitle.setBookCode(bookCode);
				bookTitle.setStatus(status);
				sys0201DAO.changeStatus(bookTitle);
			}
		}
	}
//	@Override
//	public void changeBookStatusByBookCode(String bookCode, int status) {
//		Book book = new Book();
//		book.setBookCode(bookCode);
//		book.setStatus(status);
//		sys0203DAO.changeBookStatusByBookCode(book);
//	}
	@Override
	public int getBookAvailableNumber(String bookCode) {
		return sys0203DAO.getBookAvailableNumber(bookCode);
	}

}