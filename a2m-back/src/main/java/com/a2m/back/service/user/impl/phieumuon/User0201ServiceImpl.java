package com.a2m.back.service.user.impl.phieumuon;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.dao.sys.book.Sys0203DAO;
import com.a2m.back.dao.sys.phieumuon.Sys0301DAO;
import com.a2m.back.dao.user.phieumuon.User0201DAO;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.phieumuonResponse;
//import com.a2m.back.dao.sys.book.Sys0203DAO;
import com.a2m.back.model.sys.book.Book;
import com.a2m.back.model.sys.phieumuon.BorrowedBooksDto;
import com.a2m.back.model.user.book.NotificationDto;
import com.a2m.back.service.sse.SeeNotificationService;
import com.a2m.back.service.sys.book.Sys0203Service;
import com.a2m.back.service.user.book.User0104Service;
import com.a2m.back.service.user.phieumuon.User0201Service;
@Service
public class User0201ServiceImpl implements User0201Service{
	
	@Autowired
	User0201DAO user0201DAO;
	
	@Autowired
	Sys0203DAO sys0203DAO;
	
	@Autowired
	Sys0203Service sys0203Service;
	
	@Autowired
	User0104Service user0104Service;
	
	@Autowired 
	Sys0301DAO sys0301DAO;
	
	@Autowired
    private SeeNotificationService seeNotificationService;
	
	@Override
	public void addPhieuMuon(phieumuonResponse phieumuon){
//		System.out.println(phieumuon.getBorrowDate());
		List<BookResponse> listBook = phieumuon.getListBook();
		NotificationDto notification = new NotificationDto();
		int ID_PHIEU_MUON = 0;
//		if (user0201DAO.checkIdPhieuMuonByUserUid(phieumuon.getUserUid()) != 0) throw new Exception();
		user0201DAO.addPhieuMuon(phieumuon);
//		System.out.println(phieumuon.getBorrowDate());
//		System.out.println(phieumuon.getCreatedDate());
		ID_PHIEU_MUON = user0201DAO.getIdPhieuMuonByUserUid(phieumuon.getUserUid());
		for (int i = 0; i < listBook.size(); i++) {
			BorrowedBooksDto borrowed = new BorrowedBooksDto();
			//lấy bookId của quyển sách cho  bạn đọc  mượn
			String bookId = getAvailableBookByBookCode(listBook.get(i).getBookCode());
			
			//nếu bookId bằng rỗng tức là hiện không có sách đang có sẵn
			//bạn đọc đang muốn mượn quyển sách trong trạng thái có ngày dự kiến sẽ có  là 1 ngày cụ thể
			if(bookId == null) {
				//lấy ra ds các quyển sách đang được mượn
				List<BorrowedBooksDto> listSachMuon =  sys0203DAO.getBorrowedBookByBookCode(listBook.get(i).getBookCode(), 1);
				//xác định các phiếu mượn có đầu sách này
				List<phieumuonResponse> listPhieuMuon =  new ArrayList<phieumuonResponse>();
				for(BorrowedBooksDto x: listSachMuon) {
					  listPhieuMuon.add(sys0301DAO.getPhieuMuonByIdPhieuMuon(x.getID_PHIEU_MUON()));
				}
				
				Date earliestDate =  new Date();
				earliestDate =  listPhieuMuon.get(0).getReturnDateEstimate();
				bookId = listSachMuon.get(0).getBookId();
				//xác định ngày sớm nhất có sách
				for(int j = 0; j < listPhieuMuon.size(); j++) {
					if(listPhieuMuon.get(j).getReturnDateEstimate().before(earliestDate)) {
						earliestDate =  listPhieuMuon.get(j).getReturnDateEstimate();
						bookId = listSachMuon.get(j).getBookId();
					}
				}
				borrowed.setBookId(bookId);
				borrowed.setRequired(0);
			}
			else {
				borrowed.setBookId(bookId);
				borrowed.setRequired(1);
			}
			borrowed.setID_PHIEU_MUON(ID_PHIEU_MUON);
			user0201DAO.addSachMuon(borrowed);
		}
		
		SimpleDateFormat DateFor = new SimpleDateFormat("dd/MM/yyyy");
		notification.setRead(false);
		notification.setAbout(1);
		notification.setUserUid(phieumuon.getUserUid().toString());
		notification.setDate_add(new Date());
		notification.setContent("Bạn đã tạo phiếu mượn thành công. Ngày bạn hẹn lấy là " + DateFor.format(phieumuon.getBorrowDate()));
		notification.setId(ID_PHIEU_MUON + "");
		user0104Service.addNotification(notification);
		
	}
	
	
	@Override
	public String getAvailableBookByBookCode(String bookCode) {
		return user0201DAO.getAvailableBookByBookCode(bookCode);
	}

	@Override
	public List<Book> getBooksByBookCode(String bookCode){
		List<Book> books = new ArrayList<Book>();
		books = sys0203DAO.getBooksByBookCode(bookCode);
		return books;
	}
	
	@Override
	public int checkPhieuMuonExists(Long userUid) {
//		System.out.println(user0201DAO.checkPhieuMuonExists(userUid));
		return user0201DAO.checkPhieuMuonExists(userUid);
	}


	@Override
	public String getAvailableBookByBookCodeToBorrow(String bookCode) {
		return user0201DAO.getAvailableBookByBookCodeToBorrow(bookCode);

	}


	
}