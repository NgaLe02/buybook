package com.a2m.back.service.comm;

import java.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {
	public void uploadFile(MultipartFile file, String bookCode, String typeFile, int fileName) throws IOException;

	public void uploadFile2(MultipartFile file) throws IOException;

	public Resource downloadFile(String fileName) throws Exception;
	
	public boolean delete(String fileName);
}
