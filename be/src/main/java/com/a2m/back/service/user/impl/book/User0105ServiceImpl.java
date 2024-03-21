package com.a2m.back.service.user.impl.book;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.dao.sys.book.Sys0204DAO;
import com.a2m.back.dao.user.book.User0105DAO;
import com.a2m.back.model.resp.EvaluationResponse;
import com.a2m.back.model.user.book.EvaluationDto;
import com.a2m.back.service.sys.Sys0101Service;
import com.a2m.back.service.user.book.User0105Service;

@Service
public class User0105ServiceImpl implements User0105Service {

	@Autowired
	User0105DAO user0105DAO;

	@Autowired
	Sys0101Service sys0101Service;
	
	@Autowired
	Sys0204DAO sys0204DAO;

	@Override
	public int insert(EvaluationDto e) {
		int result = user0105DAO.insert(e);
		int id = user0105DAO.getEvaluateIdMax();
		user0105DAO.updateEvaluate(1, Integer.parseInt(e.getSachmuon_id()));
		return id;
	}

	@Override
	public List<EvaluationResponse> getAllByBookCode(String bookCode) {
		List<EvaluationResponse> result = user0105DAO.getAllByBookCode(bookCode);
		return result;
	}

	@Override
	public EvaluationResponse getEvaluateOfBook(String sachMuonId) {
		EvaluationResponse result =  user0105DAO.getEvaluateOfBook(sachMuonId);
		result.setUserInfo(sys0101Service.getUserInfoByUserUid(result.getUser_uid()));
		result.setImages(sys0204DAO.getImagesByEvaluateId(result.getEvaluate_id() + "", 1));
		return result;
	}

	@Override
	public int update(EvaluationDto e) {
		int result = user0105DAO.update(e);
	
		return result;
	}

}
