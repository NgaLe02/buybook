package com.a2m.back.service.sys.book;

import java.util.List;

import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.UserResponse;

public interface Sys0205Service {

	List<BookResponse> getBookToStatistic(String search, int page, int type);

	int countBookToStatistic(String search, int page, int type);

	UserResponse getUserToStatistic(UserResponse book);

	List<BookResponse> getBookBorrowedOfUserByUserUid(String userUid, int type, String search);

	List<UserResponse> getUserBorrowOfBook(String bookCode, int type, String search);

}
