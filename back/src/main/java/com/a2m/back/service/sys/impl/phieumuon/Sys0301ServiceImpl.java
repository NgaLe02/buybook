package com.a2m.back.service.sys.impl.phieumuon;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.dao.sys.book.Sys0203DAO;
import com.a2m.back.dao.sys.phieumuon.Sys0301DAO;
import com.a2m.back.dao.sys.phieumuon.Sys0303DAO;
import com.a2m.back.dao.user.book.User0104DAO;
import com.a2m.back.dao.user.phieumuon.User0201DAO;
import com.a2m.back.dao.user.phieumuon.User0202DAO;
import com.a2m.back.exception.exc.CustomException;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.UserResponse;
import com.a2m.back.model.resp.phieumuonResponse;
import com.a2m.back.model.user.book.NotificationDto;
import com.a2m.back.service.sse.SeeNotificationService;
import com.a2m.back.service.sys.impl.Sys0101ServiceImpl;
import com.a2m.back.service.sys.phieumuon.Sys0301Service;

@Service
public class Sys0301ServiceImpl implements Sys0301Service {
    @Autowired
    Sys0301DAO sys0301DAO;
    @Autowired
    Sys0101ServiceImpl sys0101Service;

    @Autowired
    User0104DAO user0104DAO;

    @Autowired
    User0202DAO user0202DAO;

    @Autowired
    User0201DAO user0201DAO;
    
    @Autowired
    Sys0303DAO sys0303DAO;
    
    @Autowired
    Sys0203DAO sys0203DAO;
    @Autowired
    private SeeNotificationService seeNotificationService;


    @Override
    public List<phieumuonResponse> getAllPhieuMuon(int STATUS) {
        List<phieumuonResponse> listRespose = sys0301DAO.getAllPhieuMuon(STATUS);
        List<String> listUserUid = getAllUserUid(STATUS);
        for (int i = 0; i < listUserUid.size(); i++) {
            UserResponse user = sys0101Service.getUserInfoByUserUid(listUserUid.get(i));
            for (int j = 0; j < listRespose.size(); j++) {
                if (user.getUserUid().equals(listRespose.get(j).getUserUid().toString())) {
                    listRespose.get(j).setUserInfo(user);
                }
            }
        }
        for (int i = 0; i < listRespose.size(); i++) {
            int idPhieuMuon = listRespose.get(i).getIdPhieuMuon();
            int countBook = getCountBook(idPhieuMuon);
            listRespose.get(i).setCountBook(countBook);
        }
        return listRespose;
    }

    @Override
    public List<phieumuonResponse> getPhieuMuonInfo(String USER_UID, int STATUS) {
        List<phieumuonResponse> listPhieuMuonByStatusAndUserUID = sys0301DAO.getPhieuMuonInfo(USER_UID, STATUS);
        return listPhieuMuonByStatusAndUserUID;
    }

    @Override
    public phieumuonResponse getDetailPhieuMuon(String USER_UID, int STATUS) {
        phieumuonResponse phieumuonResponse =  sys0301DAO.getDetailPhieuMuon(USER_UID,STATUS);
        List<BookResponse> bookResponseList = sys0303DAO.getAllBook(phieumuonResponse.getIdPhieuMuon());
        phieumuonResponse.setListBook(bookResponseList);
        return phieumuonResponse;
    }

    @Override
    public void xacNhan(int STATUS, int idPhieuMuon,  List<String> listIdSelectedBook) throws Exception{
    	
    	//kiểm tra: nếu bạn đọc còn 1 phiếu đang mượn thì không thể xác nhận
    	try {
    		phieumuonResponse phieuMuon = sys0303DAO.getDetailPhieuMuon(idPhieuMuon);
        	int soPhieuDangMuon =  getCountPhieuByStatusAndUserUid(1, phieuMuon.getUserUid() + "");
            String userUid = user0201DAO.getUserUidByIdPhieuMuon(idPhieuMuon + "");

        	if(soPhieuDangMuon == 1) {
                List<phieumuonResponse> listResponse = user0202DAO.getAllPhieuMuon(1, userUid);
                String errorMessage = "Bạn đọc còn 1 phiếu mượn chưa trả. Bạn đọc cần trả phiếu mượn trước khi mượn phiếu mới!";
                CustomException exception = new CustomException(errorMessage);
                exception.setData(listResponse.get(0).getIdPhieuMuon());
        		throw exception;
        	}
        	//nếu kiểm tra thành công
            sys0301DAO.changeStatus(STATUS, idPhieuMuon, listIdSelectedBook); 
            
            List<String> listBookId = user0202DAO.getBookIDByIDPhieuMuon(idPhieuMuon + "");
            //nếu số lượng sách cho mượn ít hơn số lướn sách bạn đọc muốn mượn
            // => những cuốn sách trong trạng thái không là có sẵn vẫn chưa có để người dùng có thể mượn
            // => cho trạng thái của chúng là -1
            if(listBookId.size() >  listIdSelectedBook.size()) {
            	for(String x : listBookId) {
            		if(!listIdSelectedBook.contains(x.substring(0, 4))) {
                    	sys0203DAO.changeStatusBookBorrowed(-1,  idPhieuMuon, x);
            		}
            	}
            }
         
            
            //gửi thông báo cho bạn đọc
            NotificationDto notification = new NotificationDto();

    		SimpleDateFormat DateFor = new SimpleDateFormat("dd/MM/yyyy");

            notification.setRead(false);
            notification.setAbout(2);
            notification.setUserUid(userUid);
            notification.setDate_add(new Date());
            Date returnDate_Estimate =  new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 14));
    		notification.setContent("Phiếu mượn có mã là " + idPhieuMuon + " đã được xác nhận thành công. Bạn cần trả sách trước " + DateFor.format(returnDate_Estimate));

//            notification.setContent("Phieu muon cua ban da duoc xac nhan thanh cong");
            notification.setId(idPhieuMuon + "");
            user0104DAO.addNotification(notification);

            List<BookResponse> listBook = new ArrayList<>();
            for (int i = 0; i < listBookId.size(); i++) {
                listBook.add(user0202DAO.getBookByBookID(listBookId.get(i)));
            }
    		seeNotificationService.sendSseNotification(userUid, notification.getContent());
    	}
    	catch(Exception e) {
    	    throw e;
    	}
    }

    @Override
    public List<String> getAllUserUid(int STATUS) {
        return sys0301DAO.getAllUserUid(STATUS);
    }

    @Override
    public Integer getCountBook(int idPhieuMuon) {
        return sys0301DAO.getCountBook(idPhieuMuon);
    }

    @Override
    public int getQuantityPhieuOfUser(String userUid) {
        int result = sys0301DAO.getQuantityPhieuOfUser(userUid);
        return result;
    }

    @Override
    public List<phieumuonResponse> selectByPagination(int STATUS, String page, int statusBorrowDate) {
        List<phieumuonResponse> listRespose = sys0301DAO.selectByPagination(STATUS, ((Integer.parseInt(page)) - 1) * 5);
        List<String> listUserUid = getAllUserUid(STATUS);
        for (int i = 0; i < listUserUid.size(); i++) {
            UserResponse user = sys0101Service.getUserInfoByUserUid(listUserUid.get(i));
            for (int j = 0; j < listRespose.size(); j++) {
                if (user.getUserUid().equals(listRespose.get(j).getUserUid().toString())) {
                    listRespose.get(j).setUserInfo(user);
                }
            }
        }
        for (int i = 0; i < listRespose.size(); i++) {
            int idPhieuMuon = listRespose.get(i).getIdPhieuMuon();
            int countBook = getCountBook(idPhieuMuon);
            listRespose.get(i).setCountBook(countBook);
        }
        
        Date now = new Date();

        List<phieumuonResponse> listResposeNew = new ArrayList<phieumuonResponse>();

        //lấy phiếu còn hạn
        if(statusBorrowDate == 1) {
        	for(phieumuonResponse x : listRespose) {
        		 if (x.getBorrowDate().after(now)) {
        			listResposeNew.add(x);
        		} 
        	}
        }
        
        //lấy phiếu quá hạn
        if(statusBorrowDate == 2) {
        	for(phieumuonResponse x : listRespose) {
        		LocalDate borrowDate = x.getBorrowDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        		
        		if (!x.getBorrowDate().after(now)) {
    			listResposeNew.add(x);
    		} 
        	}
        }
        
        
        if(statusBorrowDate == 0) {
        	for(phieumuonResponse x : listRespose) {
        		LocalDate borrowDate = x.getBorrowDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        		
        		if (!x.getBorrowDate().after(now)) {
    			x.setStatusBorrowDate(2);;
    		} 
        		else  {
        			x.setStatusBorrowDate(1);
        		}
        	}
            return listRespose;
        }
        else {
            return listResposeNew;

        }
    }


    public List<phieumuonResponse> selectByPaginationAndUsername(int STATUS, String page, String username) {
        List<phieumuonResponse> listRespose = sys0301DAO.selectByPagination(STATUS, ((Integer.parseInt(page)) - 1) * 5);
        List<String> listUserUid = getAllUserUid(STATUS);
        for (int i = 0; i < listUserUid.size(); i++) {
            UserResponse user = sys0101Service.getUserInfoByUserUid(listUserUid.get(i));
            for (int j = 0; j < listRespose.size(); j++) {
                if (user.getUserUid().equals(listRespose.get(j).getUserUid().toString())) {
                    listRespose.get(j).setUserInfo(user);
                }
            }
        }
        for (int i = 0; i < listRespose.size(); i++) {
            int idPhieuMuon = listRespose.get(i).getIdPhieuMuon();
            int countBook = getCountBook(idPhieuMuon);
            listRespose.get(i).setCountBook(countBook);
        }
        return listRespose;
    }

    @Override
    public List<phieumuonResponse> selectPhieuMuonByUsername(int status, String username) {
        List<String> listUserUid = getAllUserUid(status);
        List<phieumuonResponse> listRespose = new ArrayList<>();
        for (int i = 0; i < listUserUid.size(); i++) {
            UserResponse user = sys0101Service.getUserInfoByUserUid(listUserUid.get(i));
            if (user.getFullName().toLowerCase().indexOf(username.toLowerCase())!=-1) {
                List<phieumuonResponse> listPhieuMuonByStatusAndUserUid = sys0301DAO.getPhieuMuonInfo(user.getUserUid(),status);
                listRespose.addAll(listPhieuMuonByStatusAndUserUid);
                for (int j = 0; j < listRespose.size(); j++) {
                    if (user.getUserUid().equals(listRespose.get(j).getUserUid().toString())) {
                        listRespose.get(j).setUserInfo(user);
                    }
                }
            }
        }
        for (int i = 0; i < listRespose.size(); i++) {
            int idPhieuMuon = listRespose.get(i).getIdPhieuMuon();
            int countBook = getCountBook(idPhieuMuon);
            listRespose.get(i).setCountBook(countBook);
        }
        return listRespose;
    }

    @Override
    public Integer getCountPhieuByStatus(int status) {
        return sys0301DAO.getCountPhieuByStatus(status);
    }

    @Override
    public Integer getCountPhieuByStatusAndUserUid(int status, String userUid) {
        return sys0301DAO.getCountPhieuByStatusAndUserUid(status, userUid);
    }
}