package com.a2m.back.service.comm.impl;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.a2m.back.service.comm.FileService;

@Service
public class FileServiceImpl implements FileService {

	@Autowired
	private ResourceLoader resourceLoader;

	@Value("${path.default.uploaddirbook}")
	private String pathBook;

	@Override
	public void uploadFile(MultipartFile file, String bookCode, String typeFile, int fileName) throws IOException {
		String originalFileName = file.getOriginalFilename();
		int dotIndex = originalFileName.lastIndexOf(".");
		String fileExtension = originalFileName.substring(dotIndex, originalFileName.length());

		String filePath = pathBook + bookCode + (fileName + 1) + fileExtension;
		File file1 = new File(filePath);

		if (!file1.exists()) {
			if (file1.createNewFile()) {
				System.out.println("File is created! " + file1.getAbsolutePath());
			} else {
				System.out.println("Failed to create file.");
			}
		} else {
			System.out.println("File already exists.");
		}

		BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(file1));
		stream.write(file.getBytes());
//	    sys0201DAO.changeStatusEbook(bookCode, "1");
		stream.close();
	}

	@Override
	public Resource downloadFile(String fileName) throws Exception {
		final Resource fileResource = resourceLoader.getResource("classpath:assets/images/book/" + fileName);
		return fileResource;
	}

	@Override
	public void uploadFile2(MultipartFile file) throws IOException {
		String originalFileName = file.getOriginalFilename();
		
		String filePath = pathBook + originalFileName;
		File file1 = new File(filePath);

		if (!file1.exists()) {
			if (file1.createNewFile()) {
				System.out.println("File is created! " + file1.getAbsolutePath());
			} else {
				System.out.println("Failed to create file.");
			}
		} else {
			System.out.println("File already exists.");
		}

		BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(file1));
		stream.write(file.getBytes());
		stream.close();
	}

}
