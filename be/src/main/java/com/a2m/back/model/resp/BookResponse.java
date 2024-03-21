package com.a2m.back.model.resp;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

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
@Document(indexName="dausach")
public class BookResponse {
	@Id
	private String bookCode;
	private String title;
	private String publisher;
	private int price;
	private int pages;
	private String description;
	private String status;
	private String author;
	private String catsName;
	private int createdYear;
	private int category;
	private String img;
	private int quantity;
	//dùng để lấy id sách mượn của đầu sách 
	private String book_id;
	private String sachMuon_id;
	private List<GenreBookDto> genres;
	private Date dateAdd;
	private boolean ebook;
	private String qrCodeImage;
	private List<ImageBook> images;
	private List<EvaluationResponse> eval;
	private int numberAccess;
	
	private int numberOfTimesBorrowed;
	private int numberOfBorrowing;
	private int numberOfLost;
	
	private int numberOfTimesBorrowedOfUser;
	private int numberOfLostOfUser;
	
	private String estimateTimeHave;
	
	  // đầu sách có bắt buộc có không khi bạn đọc mượn phiếu
	private  int required;
	private  int rating;
}
