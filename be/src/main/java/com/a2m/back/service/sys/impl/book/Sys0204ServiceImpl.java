package com.a2m.back.service.sys.impl.book;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.a2m.back.dao.sys.book.Sys0204DAO;
import com.a2m.back.model.sys.book.ImageBook;
import com.a2m.back.service.sys.book.Sys0204Service;

@Service
public class Sys0204ServiceImpl implements Sys0204Service{
	
	@Autowired
	Sys0204DAO sys0204DAO;

	@Override
	public int countImageByBookCode(String bookCode) {
		int result = sys0204DAO.countImageByBookCode(bookCode);
		return result;
	}

	@Override
	public int addImageInBookTitle(ImageBook imageBook) {
		int result = sys0204DAO.addImageInBookTitle(imageBook);
		return result;
	}

	@Override
	public List<ImageBook> getImagesByBookCode(String bookCode, int status) {
		List<ImageBook> images = sys0204DAO.getImagesByBookCode(bookCode, status);
		return images;
	}

	@Override
	public void changeStatusImageById(List<String> listBookId) {
		for(String id: listBookId) {
			sys0204DAO.changeStatusImageById(id, 0);
		}
	}

	@Override
	public int countImageByEvaluateId(String evaluateId) {
		int result = sys0204DAO.countImageByEvaluateId(evaluateId);
		return result;
	}

	@Override
	public int changeStatusImageByAbout(String bookCode, int about) {
		int result = sys0204DAO.changeStatusImageByAbout(bookCode, about);
		return result;
	}

	
}
