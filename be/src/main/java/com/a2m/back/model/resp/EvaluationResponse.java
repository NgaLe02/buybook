package com.a2m.back.model.resp;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.a2m.back.model.sys.book.ImageBook;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EvaluationResponse {
	private static final long serialVersionUID = 12L;
	private int evaluate_id;
    private String sachmuon_id;
    private String user_uid;
    private UserResponse userInfo; 
	@NotNull
    private String content;
	private Date date_evaluate;
	private List<ImageBook> images;
	private int star;

}
