package com.a2m.back.controller.user.book;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.model.resp.DataResponse;
import com.a2m.back.model.resp.EvaluationResponse;
import com.a2m.back.model.user.book.EvaluationDto;
import com.a2m.back.service.user.book.User0105Service;
import com.a2m.back.util.JwtProvinderUtils;

@RestController
@RequestMapping("api/user/evaluate")
@Controller
public class User0105Controller {
	
	@Autowired
	User0105Service user0105Service;
	
	@Autowired
    private JwtProvinderUtils jwtProvinderUtils;
	
	@GetMapping("get/{bookCode}")
	public ResponseEntity<DataResponse> getAllByBookCode(@PathVariable String bookCode) {
		DataResponse resp = new DataResponse();
		try {
			List<EvaluationResponse> listEvaluatation = user0105Service.getAllByBookCode(bookCode);
			resp.setStatus(CommonConstants.RESULT_OK);
			resp.setResponseData(listEvaluatation);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
	
	@PostMapping("insert")
	public ResponseEntity<DataResponse> insert(@RequestBody EvaluationDto eva,  HttpServletRequest request) {
		DataResponse resp = new DataResponse();
		
		 String jwt = jwtProvinderUtils.parseJwt(request);
	        String userUid = "";
	        try {
	            userUid = jwtProvinderUtils.getUserUidFromJwtToken(jwt);
	        } catch (Exception e) {
	            e.printStackTrace();
	            resp.setStatus(CommonConstants.RESULT_WN);
	            resp.setMessage("Người dùng chưa đăng nhập!");
	        }
	        
		try {
			eva.setUser_uid(userUid);
			int result = user0105Service.insert(eva);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
}
