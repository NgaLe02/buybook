package com.a2m.back.dao.user.book;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.a2m.back.model.resp.EvaluationResponse;
import com.a2m.back.model.user.book.EvaluationDto;

@Mapper
public interface User0105DAO {
	int insert(EvaluationDto e);

	List<EvaluationResponse> getAllByBookCode(String bookCode);
}
