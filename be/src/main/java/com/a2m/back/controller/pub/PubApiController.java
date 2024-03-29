package com.a2m.back.controller.pub;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.dao.sys.book.Sys0202DAO;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.DataResponse;
import com.a2m.back.model.resp.GenreBookResponse;
import com.a2m.back.model.sys.book.BookTitle;
import com.a2m.back.service.comm.FileService;
import com.a2m.back.service.qrcode.QrCodeService;
import com.a2m.back.service.sys.book.Sys0201Service;
import com.a2m.back.service.user.UserService;

@RestController
@RequestMapping("api/public")
public class PubApiController {
	@Autowired
	private UserService userService;

	@Autowired
	Sys0201Service sys0201Service;

	@Autowired
	Sys0202DAO sys0202DAO;

	@Autowired
	FileService fileService;

	@Autowired
	private QrCodeService qrCodeService;

	private static Path resourcePath;

	@Value("${path.default.uploaddirbook}")
	private String path;

	@GetMapping("/download/{filename}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {

//		Resource resource = null;
		try {
			Path file = Paths.get(path).resolve(filename);
			Resource resource = new UrlResource(file.toUri());
//			resource = fileService.downloadFile(filename);
//			String contentType = "application/pdf";

//			System.out.println("download");
//			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
//					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
//					.body(resource);
			if (resource.exists() || resource.isReadable()) {
				return ResponseEntity.ok().body(resource);
			} else {
				throw new RuntimeException("Could not read the file!");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

	}

	@GetMapping("getBookTitle")
	public ResponseEntity<DataResponse> getBookTitle(@RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "page", required = false) int page,
			@RequestParam(value = "category", required = false) String category, // đây là id
			@RequestParam(value = "categoryByName", required = false) String categoryByName,
			@RequestParam(value = "listCategory", required = false) int[] listCategory,
			@RequestParam(value = "listAuthor", required = false) String[] listAuthor,
			@RequestParam(value = "type", required = false) String[] type) {
		DataResponse resp = new DataResponse();
		try {
			List<BookResponse> result = sys0201Service.getBooksLimit(12, page + "", search, category, listCategory,
					listAuthor, categoryByName, type);
			resp.setListResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("get/{bookCode}")
	public ResponseEntity<DataResponse> getBookInfo(@PathVariable String bookCode) {
		DataResponse resp = new DataResponse();
		try {
			BookResponse book = sys0201Service.getBookInfo(bookCode);
			resp.setResponseData(book);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("getGenreList")
	public ResponseEntity<DataResponse> getGenreList() {
		DataResponse resp = new DataResponse();
		try {
			List<GenreBookResponse> result = sys0202DAO.getAllGenres();
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("countTotalBookTitle")
	public ResponseEntity<DataResponse> countTotalBookTitle(@RequestParam("search") String search,
			@RequestParam(value = "category", required = false) String category,
			@RequestParam(value = "listAuthor", required = false) String[] listAuthor,
			@RequestParam(value = "categoryByName", required = false) String categoryByName,
			@RequestParam(value = "type", required = false) String[] type) {
		DataResponse resp = new DataResponse();
		try {
			int result = sys0201Service.countTotalBookTitle(search, category, listAuthor, categoryByName, type);
			resp.setResponseData(result);
			;
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@PostConstruct
	public void initPath() {
		resourcePath = Paths.get(path).toAbsolutePath().normalize();
		try {
			Files.createDirectories(resourcePath);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@GetMapping(value = "getFile/{fileName}")
	public void getImage(@PathVariable String fileName, HttpServletResponse httpServletResponse,
			@RequestParam(value = "type", required = false) String type) {
		try {
			if (type == null) {
				Path targetLocation = resourcePath.resolve(fileName);
				httpServletResponse.setContentType(Files.probeContentType(targetLocation));
				Files.copy(targetLocation, httpServletResponse.getOutputStream());
			} else {
				fileService.delete(fileName);
			}

		} catch (Exception e) {

		}
	}

	@GetMapping("/get/cover/{fileName}")
	public ResponseEntity<DataResponse> getBookCover(@PathVariable String fileName) {
		DataResponse resp = new DataResponse();
		try {
			String base64Image = sys0201Service.getBookCover(fileName);
			resp.setStatus(CommonConstants.RESULT_OK);
			resp.setResponseData(base64Image);

		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("get/genre/{genre_id}")
	public ResponseEntity<DataResponse> getBookTitleByGenre(@PathVariable int genre_id,
			@RequestParam(value = "page", required = false) int page) {
		DataResponse resp = new DataResponse();
		try {
			List<BookTitle> result = sys0201Service.getBookTitleByGenre(genre_id, page);
			resp.setResponseData(result);
			;
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("get/author")
	public ResponseEntity<DataResponse> getAuthor() {
		DataResponse resp = new DataResponse();
		try {
			List<String> result = sys0201Service.getAuthor();
			resp.setResponseData(result);
			;
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
	
	@GetMapping("add/access/{bookCode}")
	public ResponseEntity<DataResponse> addAccess(@PathVariable String bookCode) {
		DataResponse resp = new DataResponse();
		try {
			int result = sys0201Service.addAccess(bookCode);
			resp.setResponseData(result);

			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

}
