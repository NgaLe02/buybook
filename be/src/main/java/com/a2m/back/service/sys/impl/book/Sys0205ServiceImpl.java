package com.a2m.back.service.sys.impl.book;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.dao.sys.book.Sys0201DAO;
import com.a2m.back.dao.sys.book.Sys0204DAO;
import com.a2m.back.dao.sys.book.Sys0205DAO;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.UserResponse;
import com.a2m.back.service.sys.Sys0101Service;
import com.a2m.back.service.sys.book.Sys0201Service;
import com.a2m.back.service.sys.book.Sys0205Service;

@Service
public class Sys0205ServiceImpl implements Sys0205Service {

	@Autowired
	Sys0205DAO sys0205DAO;

	@Autowired
	Sys0201DAO sys0201DAO;

	@Autowired
	Sys0204DAO sys0204DAO;

	@Autowired
	Sys0101Service sys0101Service;

	@Autowired
	Sys0201Service sys0201Service;

	@Override
	public List<BookResponse> getBookToStatistic(String search, int page, int type) {
		String[] typeF = { type + "" };
		List<BookResponse> listBook = sys0201Service.getBooksLimit(10, page + "", search, "", null, null, "", typeF);
		for (BookResponse book : listBook) {
			List<Integer> result = sys0205DAO.getBookToStatistic(book.getBookCode());
			book.setNumberOfBorrowing(result.get(0));
			book.setNumberOfTimesBorrowed(result.get(1));
			book.setNumberOfLost(result.get(2));
		}

		// Sắp xếp danh sách theo thuộc tính setNumberOfTimesBorrowed giảm dần
		Collections.sort(listBook, Comparator.comparingInt(BookResponse::getNumberOfTimesBorrowed).reversed());
		return listBook;
	}

	@Override
	public UserResponse getUserToStatistic(UserResponse user) {
		List<Integer> result = sys0205DAO.getUserToStatistic(user.getUserUid());
		user.setNumberOfReturnLate(result.get(0));
		user.setNumberOfBookLost(result.get(1));
		user.setNumberOfBookBorrowed(result.get(2));
		return user;
	}

	@Override
	public List<BookResponse> getBookBorrowedOfUserByUserUid(String userUid, int type, String search) {
		List<BookResponse> books = new ArrayList<>();
		if (type == 0) {
			books = sys0205DAO.getBookBorrowedOfUserByUserUid(userUid, search);
			for (int i = 0; i < books.size(); i++) {
//					books.get(i).setQuantity(sys0201DAO.countBooksAvailable(books.get(i).getBookCode()));
				books.get(i).setImages(sys0204DAO.getImagesByBookCode(books.get(i).getBookCode(), 1));
				books.get(i)
						.setNumberOfLostOfUser(sys0205DAO.getNumberBookLostOfUser(books.get(i).getBookCode(), userUid));
			}
		} else {
			books = sys0201DAO.getListEbookOfAUser(userUid, search);
			for (int i = 0; i < books.size(); i++) {
				books.get(i).setImages(sys0204DAO.getImagesByBookCode(books.get(i).getBookCode(), 1));
			}
		}
		return books;
	}

	@Override
	public List<UserResponse> getUserBorrowOfBook(String bookCode, int type, String search) {
		List<UserResponse> users = new ArrayList<>();

		if (type == 0) {
			List<String> listUserUid = sys0205DAO.getUserBorrowOfBook(bookCode, type, search);

			for (String userUid : listUserUid) {
				UserResponse user = sys0101Service.getUserInfoByUserUid(userUid);
				if (!user.getFullName().contains(search))
					break;
				List<Integer> result = sys0205DAO.getUserBorrowOfBookToStatistic(user.getUserUid(), bookCode);
//					user.setNumberOfReturnLate(result.get(0));
				// SỐ LÀN LÀM mất 1 quyển sách đó
				user.setNumberOfBookLost(result.get(0));
				// số lân mượn 1 quyển sách đó
				user.setNumberOfBookBorrowed(result.get(1));
				users.add(user);
			}
		} else {
			List<UserResponse> userss = sys0201DAO.countAccessOfEbookOfListUser(bookCode, search);
			for (UserResponse tmp : userss) {
				UserResponse user = sys0101Service.getUserInfoByUserUid(tmp.getUserUid());
				user.setNumberAccess(tmp.getNumberAccess());
				users.add(user);
			}
		}

		return users;
	}

	@Override
	public int countBookToStatistic(String search, int page, int type) {
		String[] typeF = { type + "" };

		int result = sys0201Service.countTotalBookTitle(search, "", null, "", typeF);
		return result;
	}

}
