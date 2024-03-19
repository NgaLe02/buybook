package com.a2m.back.service.user.book;

import java.util.List;

import com.a2m.back.model.resp.EvaluationResponse;
import com.a2m.back.model.user.book.EvaluationDto;

public interface User0105Service {
	
	int insert(EvaluationDto e);
	
	List<EvaluationResponse> getAllByBookCode(String bookCode);
	
}
