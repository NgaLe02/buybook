package com.a2m.back.controller.user.book;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.DataResponse;
import com.a2m.back.model.user.book.CartDto;
import com.a2m.back.service.comm.CommonService;
import com.a2m.back.service.user.book.User0101Service;
import com.a2m.back.util.JwtProvinderUtils;

@RestController
@RequestMapping("api/user/cart")
public class User0101Controller {
	@Autowired
	User0101Service user0101Service;

	@Autowired
	private CommonService commonService;

	@PostMapping("insert")
    public ResponseEntity<DataResponse> insert(@RequestBody CartDto cart){
		DataResponse resp = new DataResponse();

		String userUid = "";
		try {
			userUid = commonService.getUserUid();
		} catch (Exception e) {
		    e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_WN);
        	resp.setMessage("Người dùng chưa đăng nhập!");
		}
		
		try {
			cart.setUserUid(userUid);
            int result = user0101Service.insert(cart);
            if(result == 1) {
            	resp.setStatus(CommonConstants.RESULT_OK);
            	resp.setMessage("Thêm sách vào giỏ hàng thành công");
                resp.setResponseData(cart);
            }
            else if(result == 0){
            	resp.setStatus(CommonConstants.RESULT_NG);
            	resp.setMessage("Sách đã đã tồn tại trong giỏ hàng!");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(CommonConstants.RESULT_NG);
        	resp.setMessage("Thêm sách vào giỏ hàng thất bại!");

        }
        return ResponseEntity.ok(resp);
    }

	@PostMapping("delete")
	public ResponseEntity<DataResponse> delete(@RequestBody CartDto cart) {
		DataResponse resp = new DataResponse();

		String userUid = "";
		try {
			userUid = commonService.getUserUid();
		} catch (Exception e) {
		    e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_WN);
        	resp.setMessage("Người dùng chưa đăng nhập!");
		}

		try {
			cart.setUserUid(userUid);
			int result = user0101Service.delete(cart);
			if (result == 1) {
				resp.setStatus(CommonConstants.RESULT_OK);
//                resp.setResponseData(cart);
			} else {
				resp.setStatus(CommonConstants.RESULT_NG);
				resp.setMessage("Sách không tồn tại trong giỏ hàng!");
			}

		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("bookInCart")
	public ResponseEntity<DataResponse> getListBookInCart() {
		DataResponse resp = new DataResponse();

		String userUid = "";
		try {
			userUid = commonService.getUserUid();
		} catch (Exception e) {
		    e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_WN);
        	resp.setMessage("Người dùng chưa đăng nhập!");
		}

		try {
			List<BookResponse> listBook = user0101Service.getListBookInCart(userUid);
			resp.setStatus(CommonConstants.RESULT_OK);
			resp.setListResponseData(listBook);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
}
