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
	public ResponseEntity<DataResponse> getBooksToStatistic(
			@RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "page", required = false) int page,
			@RequestParam(value = "type", required = false) int type) {
		DataResponse resp = new DataResponse();
		List<BookResponse> result = new ArrayList<BookResponse>();
		try {
			result = sys0205Service.getBookToStatistic(search, page, type);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("countStatisticBook")
	public ResponseEntity<DataResponse> countStatisticBook(
			@RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "page", required = false) int page,
			@RequestParam(value = "type", required = false) int type) {
		DataResponse resp = new DataResponse();
		try {
			int result = sys0205Service.countBookToStatistic(search, page, type);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("getStatisticUsers")
	public ResponseEntity<DataResponse> getUsersToStatistic(
			@RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "page", required = false) int page) {
		DataResponse resp = new DataResponse();
		List<UserResponse> result = new ArrayList<UserResponse>();
		try {
			List<UserResponse> listUser = sys0101Service.getAllUserInfo(10, page + "", search);
			for (UserResponse x : listUser) {
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

	@GetMapping("countUsersToStatistic")
	public ResponseEntity<DataResponse> countUsersToStatistic(
			@RequestParam(value = "search", required = false) String search) {
		DataResponse resp = new DataResponse();
		try {
			resp = sys0101Service.getCountAllUser(search);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("getBookBorrowedOfUser/{userUid}")
	public ResponseEntity<DataResponse> getBookBorrowedOfUser(@PathVariable String userUid,
			@RequestParam(value = "type") int type, 
			@RequestParam(value = "search", required = false) String search) {
		DataResponse resp = new DataResponse();
		List<BookResponse> result = new ArrayList<BookResponse>();
		try {
			result = sys0205Service.getBookBorrowedOfUserByUserUid(userUid, type, search);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("getUserBorrowOfBook/{bookCode}")
	public ResponseEntity<DataResponse> getUserBorrowOfBook(@PathVariable String bookCode,
			@RequestParam(value = "type") int type,
			@RequestParam(value = "search", required = false) String search) {
		DataResponse resp = new DataResponse();
		//type: ebook
		List<UserResponse> result = new ArrayList<UserResponse>();
		try {
			result = sys0205Service.getUserBorrowOfBook(bookCode, type,search);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
}
