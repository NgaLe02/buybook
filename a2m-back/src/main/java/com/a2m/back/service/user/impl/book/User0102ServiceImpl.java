package com.a2m.back.service.user.impl.book;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.dao.sys.book.Sys0203DAO;
import com.a2m.back.dao.sys.book.Sys0204DAO;
import com.a2m.back.dao.user.book.User0102DAO;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.sys.book.BookTitle;
import com.a2m.back.model.user.book.WishListDto;
import com.a2m.back.service.sse.SeeEmitterService;
import com.a2m.back.service.sse.SeeNotificationService;
import com.a2m.back.service.sys.book.Sys0201Service;
import com.a2m.back.service.user.book.User0102Service;

@Service
public class User0102ServiceImpl implements User0102Service{

	@Autowired
	User0102DAO user0102DAO;
	
	@Autowired
	SeeNotificationService sseNotificationService;
	
	@Autowired
	SeeEmitterService seeEmitterService;
	
	@Autowired 
	Sys0203DAO sys0203DAO;
	
	@Autowired
	Sys0204DAO sys0204DAO;
	
	@Autowired
	Sys0201Service sys0201Service;
	
	@Override
	public int addBookToWishList(WishListDto wishList) {
		if(user0102DAO.checkBookInWishListByUserUid(wishList)) {
			return 0;
		}
		wishList.setDate_add(new Date());
		int result = user0102DAO.addBookToWishList(wishList);
		
//		if(result == 1) {
//			seeEmitterService.subscribe(wishList.getUserUid());
//		}
		return 1;
	}

	@Override
	public int deleteFromWishList(WishListDto wishList) {
		if(!user0102DAO.checkBookInWishListByUserUid(wishList)) {
			return 0;
		}
		int result = user0102DAO.deleteFromWishList(wishList);
		return 1;
	}

	@Override
	public List<String> getUserUidByBookID(String bookCode) {
		List<String> listUserUid = user0102DAO.getUserUidByBookID(bookCode);
		return listUserUid;
	}

	@Override
	public List<BookResponse> getBookCodeOfUserUid(String userUid) {
		List<BookResponse> listBook = user0102DAO.getBookCodeOfUserUid(userUid);
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
