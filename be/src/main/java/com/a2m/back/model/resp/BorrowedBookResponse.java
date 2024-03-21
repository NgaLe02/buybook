package com.a2m.back.model.resp;

import java.util.Date;
import java.util.List;

import com.a2m.back.model.sys.book.GenreBookDto;
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
public class BorrowedBookResponse extends BookResponse {
	private int sachMuonId;
	private int ID_PHIEU_MUON;
	private String bookId;
	private String bookCodeBorrowBook;
	private int statusBorrowBook;
	private int required;
	private int evaluate;
}
