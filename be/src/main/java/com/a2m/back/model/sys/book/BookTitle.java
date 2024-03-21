package com.a2m.back.model.sys.book;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Author tiennd
 * Created date 2023-07-08
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class BookTitle {
	@Id
	private String bookCode;
	private String title;
	private String publisher;
	private int price;
	private int pages;
	private String description;
	private int status;
	private String author;
	private int createdYear;
	private int category;
	private List<GenreBookDto> genres;
	private String img;
	private int quantity;
	private Date dateAdd;
	private boolean ebook;
	private List<ImageBook> images;
}
