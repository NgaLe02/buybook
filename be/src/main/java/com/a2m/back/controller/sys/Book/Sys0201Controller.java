package com.a2m.back.controller.sys.Book;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.DataResponse;
import com.a2m.back.model.resp.UploadResponse;
import com.a2m.back.model.sys.book.BookTitle;
import com.a2m.back.model.sys.book.ImageBook;
import com.a2m.back.service.comm.FileService;
import com.a2m.back.service.qrcode.QrCodeService;
import com.a2m.back.service.sys.book.Sys0201Service;
import com.a2m.back.service.sys.book.Sys0204Service;

@RestController
@RequestMapping("api/admin/sys0201")
//đầu sách
public class Sys0201Controller {

	@Autowired
	Sys0201Service sys0201Service;

	@Autowired
	private QrCodeService qrCodeService;

	@Autowired
	private Sys0204Service sys0204Service;

	@Autowired
	FileService fileService;

	@Value("${back.api.url}")
	private String portApi;

	@PostMapping("/uploadEbook")
	public ResponseEntity<DataResponse> uploadFile(@RequestParam("files") MultipartFile uploadfile,
			@RequestParam("bookCode") String bookCode, @RequestParam("update") int update) {

		DataResponse resp = new DataResponse();

		try {
			String originalFileName = uploadfile.getOriginalFilename();
			int dotIndex = originalFileName.lastIndexOf(".");
			String typeFile = originalFileName.substring(dotIndex, originalFileName.length());
			int fileName = sys0204Service.countImageByBookCode(bookCode);
			fileService.uploadFile(uploadfile, bookCode, typeFile, fileName + 1);

			if (update == 1) {
				int ans = sys0204Service.changeStatusImageByAbout(bookCode, 1);
			}

			ImageBook imageBook = new ImageBook();
			imageBook.setBookCode(bookCode);
			imageBook.setStatus(1);
			imageBook.setPath(bookCode + (fileName + 1) + typeFile);
			imageBook.setAbout(1);
			int result = sys0204Service.addImageInBookTitle(imageBook);

//			sys0201Service.uploadEbook(uploadfile, bookCode);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			resp.setStatus(CommonConstants.RESULT_NG);
		}

		return ResponseEntity.ok(resp);
	}

	// test 0908
	@GetMapping("get")
	public ResponseEntity<DataResponse> getBooks(@RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "page", required = false) int page,
			@RequestParam(value = "status", required = false) int status,
			@RequestParam(value = "sort", required = false) String sort,
			@RequestParam(value = "type", required = false) int type) {
		DataResponse resp = new DataResponse();
		try {
			List<BookResponse> result = sys0201Service.getBooksWithStatus(10, search, page, status, type, sort);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@GetMapping("count")
	public ResponseEntity<DataResponse> count(@RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "page", required = false) int page,
			@RequestParam(value = "status", required = false) int status,
			@RequestParam(value = "type", required = false) int type) {
		DataResponse resp = new DataResponse();
		try {
			int result = sys0201Service.countBooksWithStatus(10, search, page, status, type);
			resp.setResponseData(result);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@PutMapping("update")
	public ResponseEntity<DataResponse> updateBook(@RequestBody BookTitle book) {
		DataResponse resp = new DataResponse();
		try {
			if (sys0201Service.updateBook(book) == true) {
				resp.setStatus(CommonConstants.RESULT_OK);
			} else {
				resp.setStatus(CommonConstants.RESULT_NG);
			}
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

	@PostMapping("add")
	public ResponseEntity<DataResponse> addBook(@RequestBody BookTitle book, @RequestParam int quantity,
			HttpServletResponse response) {
		DataResponse resp = new DataResponse();
		try {
			BookTitle res = sys0201Service.addBookTitle(book, quantity);
			if (res.getBookCode() != null) {
//            	qrCodeService.generateQr(res.getBookCode(), response.getOutputStream());

				ImageBook imageBook = new ImageBook();
				imageBook.setBookCode(res.getBookCode());
				imageBook.setStatus(1);
				imageBook.setPath(res.getBookCode() + "qr" + ".jpg");
				imageBook.setAbout(2);

				qrCodeService.generateQr(res.getBookCode());

				int result = sys0204Service.addImageInBookTitle(imageBook);

				resp.setStatus(CommonConstants.RESULT_OK);
				resp.setResponseData(res);
			} else
				resp.setStatus(CommonConstants.RESULT_NG);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@PostMapping("addImage")
	public ResponseEntity<?> addImages(@RequestParam("file") MultipartFile file,
			@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "type", required = false) String type) {
		String originalFileName = file.getOriginalFilename();

		String url = portApi + "/api/public/getFile/" + originalFileName;
		try {
			if (type == null) {
				fileService.uploadFile2(file);
			} else {
				fileService.delete(name);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ResponseEntity.ok().body(new UploadResponse(false, url));
	}

	@PostMapping("add/cover")
	public ResponseEntity<DataResponse> addBookCover(@RequestBody(required = false) MultipartFile[] files,
			@RequestParam("bookCode") String bookCode,
			@RequestParam(value = "imageDelete", required = false) List<String> listBookDelete) {
		DataResponse resp = new DataResponse();
		try {
			if (files != null) {
				int fileName = sys0204Service.countImageByBookCode(bookCode);
				for (MultipartFile file : files) {
					String originalFileName = file.getOriginalFilename();
					int dotIndex = originalFileName.lastIndexOf(".");
					String typeFile = originalFileName.substring(dotIndex, originalFileName.length());
					fileName++;
					fileService.uploadFile(file, bookCode, typeFile, fileName);

					ImageBook imageBook = new ImageBook();
					imageBook.setBookCode(bookCode);
					imageBook.setStatus(1);
					imageBook.setPath(bookCode + (fileName) + typeFile);
					imageBook.setAbout(0);
					int result = sys0204Service.addImageInBookTitle(imageBook);
				}
			}

			if (listBookDelete != null && listBookDelete.size() > 0) {
				sys0204Service.changeStatusImageById(listBookDelete);
			}

			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}

	@PutMapping("status/{bookCode}")
	public ResponseEntity<DataResponse> disableBookTitle(@PathVariable String bookCode, @RequestParam int status) {
		DataResponse resp = new DataResponse();
		try {
			sys0201Service.changeStatus(bookCode, status);
			resp.setStatus(CommonConstants.RESULT_OK);
		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(CommonConstants.RESULT_NG);
		}
		return ResponseEntity.ok(resp);
	}
}