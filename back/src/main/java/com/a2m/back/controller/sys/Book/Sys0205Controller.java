package com.a2m.back.controller.sys.Book;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.DataResponse;
import com.a2m.back.model.resp.UserResponse;
import com.a2m.back.service.sys.Sys0101Service;
import com.a2m.back.service.sys.book.Sys0201Service;
import com.a2m.back.service.sys.book.Sys0205Service;

@RestController
@RequestMapping("api/admin/sys0205")
//thống kê
public class Sys0205Controller {
	
	@Autowired
	Sys0205Service sys0205Service;

	@Autowired
	Sys0201Service sys0201Service;
	
	@Autowired
	Sys0101Service sys0101Service;

	@GetMapping("getStatisticBook")
	public ResponseEntity<DataResponse> getBooksToStatistic() {	
		DataResponse resp = new DataResponse();
		List<BookResponse> result = new ArrayList<BookResponse>();
		try {
			result = sys0205Service.getBookToStatistic();
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	
	@GetMapping("getStatisticUsers")
	public ResponseEntity<DataResponse> getUsersToStatistic() {	
		DataResponse resp = new DataResponse();
		List<UserResponse> result = new ArrayList<UserResponse>();
		try {
			List<UserResponse> listUser	 = sys0101Service.getListUserInfo("02-03", "1");
			for(UserResponse x : listUser) {
				result.add(sys0205Service.getUserToStatistic(x));
			}
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
	
	@GetMapping("getBookBorrowedOfUser/{userUid}")
	public ResponseEntity<DataResponse> getBookBorrowedOfUser(@PathVariable String userUid) {	
		DataResponse resp = new DataResponse();
		List<BookResponse> result = new ArrayList<BookResponse>();
		try {
			 result	= sys0205Service.getBookBorrowedOfUserByUserUid(userUid);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
	
	@GetMapping("getUserBorrowOfBook/{bookCode}")
	public ResponseEntity<DataResponse> getUserBorrowOfBook	(@PathVariable String bookCode) {	
		DataResponse resp = new DataResponse();
		List<UserResponse> result = new ArrayList<UserResponse>();
		try {
			 result	= sys0205Service.getUserBorrowOfBook(bookCode);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
}
