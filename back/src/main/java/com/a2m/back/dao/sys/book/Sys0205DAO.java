package com.a2m.back.dao.sys.book;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.UserResponse;

@Mapper
public interface Sys0205DAO {
	
	List<Integer> getBookToStatistic(String bookCode);
	
	List<Integer> getUserToStatistic(String userUid);
	
	List<BookResponse> getBookBorrowedOfUserByUserUid(String userUid);
	
	List<String> getUserBorrowOfBook(String bookCode);
	
	int getNumberBookLostOfUser(String bookCode, String userUid);
	
	List<Integer> getUserBorrowOfBookToStatistic(String userUid, String bookCode);

}
