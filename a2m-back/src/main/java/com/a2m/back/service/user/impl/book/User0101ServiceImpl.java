package com.a2m.back.service.user.impl.book;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.dao.sys.book.Sys0201DAO;
import com.a2m.back.dao.sys.book.Sys0203DAO;
import com.a2m.back.dao.sys.book.Sys0204DAO;
import com.a2m.back.dao.user.book.User0101DAO;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.user.book.CartDto;
import com.a2m.back.service.sys.book.Sys0201Service;
import com.a2m.back.service.user.book.User0101Service;

@Service
public class User0101ServiceImpl implements User0101Service{

	@Autowired
	User0101DAO user0101DAO;
	
	@Autowired
	Sys0203DAO sys0203DAO;
	
	@Autowired
	Sys0204DAO sys0204DAO;
	
	@Autowired
	Sys0201DAO sys0201DAO;
	
	@Autowired
	Sys0201Service sys0201Service;
	
	@Override
	public int insert(CartDto cartDto) {
		if(user0101DAO.checkBookExistInCart(cartDto)) {
			return 0;
		}
//		else if(sys0203DAO.getBookAvailableNumber(cartDto.getBookCode()) == 0) {
//			return 2;
//		}
		else {
			int result = user0101DAO.insert(cartDto);
			return 1;
		}
	}

	@Override
	public int delete(CartDto cartDto) {
		if(user0101DAO.checkBookExistInCart(cartDto)) {
			int delete = user0101DAO.delete(cartDto);
			return 1;
		}
		return 0;
	}

	@Override
	public List<BookResponse> getListBookInCart(String userUid) {
		List<BookResponse> listBook = user0101DAO.getListBookInCart(userUid);
		for(BookResponse x : listBook) {
			x.setQuantity(sys0203DAO.getBookAvailableNumber(x.getBookCode()));
			x.setImages(sys0204DAO.getImagesByBookCode(x.getBookCode(), 1));
//			nếu sách đang hoạt động và số lượng hiện có bằng 0 
//			(tức sách đang trong phiếu chờ hoặc mượn)
//			thì tìm thời gian sớm nhất có sách
			if(x.getStatus().equals("1")  && x.getQuantity() != 0) {
        		x.setEstimateTimeHave(CommonConstants.BOOK_STATUS_OK);
        	}
        	else if(x.getStatus().equals("1")  && x.getQuantity() == 0) {
				x.setEstimateTimeHave(sys0201Service.getEstimateTimeHaveOfBook(x.getBookCode()));
			}
			else {
				x.setEstimateTimeHave(CommonConstants.BOOK_STATUS_NG);
			}
		}
		return listBook;
	}

}
