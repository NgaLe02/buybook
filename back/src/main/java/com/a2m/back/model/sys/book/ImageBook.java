package com.a2m.back.model.sys.book;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageBook {
	private String id;
	private String bookCode;
	private int status;
	private String path;
	private int about;
}
