package com.a2m.back.controller.user.book;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.model.resp.DataResponse;
import com.a2m.back.model.resp.EvaluationResponse;
import com.a2m.back.model.sys.book.BookTitle;
import com.a2m.back.model.sys.book.ImageBook;
import com.a2m.back.model.user.book.EvaluationDto;
import com.a2m.back.service.comm.FileService;
import com.a2m.back.service.sys.book.Sys0204Service;
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
	
	@Autowired
	private Sys0204Service sys0204Service;

	@Autowired
	FileService fileService;
	
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
	
	@GetMapping("getEvaluateOfBook/{sachMuonId}")
	public ResponseEntity<DataResponse> getEvaluateOfBook(@PathVariable String sachMuonId, HttpServletRequest request) {
		DataResponse resp = new DataResponse();
		
//		 String jwt = jwtProvinderUtils.parseJwt(request);
//	        String userUid = "";
//	        try {
//	            userUid = jwtProvinderUtils.getUserUidFromJwtToken(jwt);
//	        } catch (Exception e) {
//	            e.printStackTrace();
//	            resp.setStatus(CommonConstants.RESULT_WN);
//	            resp.setMessage("Người dùng chưa đăng nhập!");
//	        }
//	        
	        
		try {
			EvaluationResponse evaluatation = user0105Service.getEvaluateOfBook(sachMuonId);
			resp.setStatus(CommonConstants.RESULT_OK);
			resp.setResponseData(evaluatation);
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
			resp.setResponseData(result);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
	
	@PostMapping("insertFile")
	public ResponseEntity<DataResponse> insertFile(@RequestBody MultipartFile[] files,
			@RequestParam("evaluateId") String evaluateId, @RequestParam(value = "imageDelete", required = false) List<String> listBookDelete) {
		DataResponse resp = new DataResponse();
		try {
			if(files != null) {
				for(MultipartFile file : files) {
					String originalFileName = file.getOriginalFilename();
					int dotIndex = originalFileName.lastIndexOf(".");
					String typeFile = originalFileName.substring(dotIndex, originalFileName.length());
					int fileName = sys0204Service.countImageByEvaluateId(evaluateId);
					fileService.uploadFile(file, evaluateId, typeFile, fileName);

					ImageBook imageBook = new ImageBook();
					imageBook.setEvaluateId(evaluateId);
					imageBook.setStatus(1);
					imageBook.setPath(evaluateId + (fileName + 1) + typeFile);
					imageBook.setAbout(3);
					int result = sys0204Service.addImageInBookTitle(imageBook);
				}
			}
			
			
			if(listBookDelete!= null && listBookDelete.size() > 0) {
				sys0204Service.changeStatusImageById(listBookDelete);
			}

			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@PutMapping("update")
	public ResponseEntity<DataResponse> update(@RequestBody EvaluationDto eva,  HttpServletRequest request) {
		DataResponse resp = new DataResponse();
		try {
			if (user0105Service.update(eva) == 1) {
				resp.setStatus(CommonConstants.RESULT_OK);
			} else {
				resp.setStatus(CommonConstants.RESULT_NG);
			}
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
}
