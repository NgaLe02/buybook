package com.a2m.back.service.user.impl.book;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.dao.user.book.User0105DAO;
import com.a2m.back.model.resp.EvaluationResponse;
import com.a2m.back.model.user.book.EvaluationDto;
import com.a2m.back.service.user.book.User0105Service;

@Service
public class User0105ServiceImpl implements User0105Service{

	@Autowired
	User0105DAO user0105DAO;
	
	@Override
	public int insert(EvaluationDto e) {
		int result = user0105DAO.insert(e);
		return result;
	}

	@Override
	public List<EvaluationResponse> getAllByBookCode(String bookCode) {
		List<EvaluationResponse> result =  user0105DAO.getAllByBookCode(bookCode);
		return result;
	}

}
