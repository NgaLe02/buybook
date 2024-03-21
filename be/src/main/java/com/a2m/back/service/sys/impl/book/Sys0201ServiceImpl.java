package com.a2m.back.service.sys.impl.book;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import com.a2m.back.constant.CommonConstants;
import com.a2m.back.dao.sys.book.Sys0201DAO;
import com.a2m.back.dao.sys.book.Sys0202DAO;
import com.a2m.back.dao.sys.book.Sys0203DAO;
import com.a2m.back.dao.sys.book.Sys0204DAO;
import com.a2m.back.dao.sys.phieumuon.Sys0301DAO;
import com.a2m.back.dao.user.book.User0105DAO;
import com.a2m.back.model.resp.BookResponse;
import com.a2m.back.model.resp.EvaluationResponse;
import com.a2m.back.model.resp.phieumuonResponse;
import com.a2m.back.model.sys.book.Book;
import com.a2m.back.model.sys.book.BookTitle;
import com.a2m.back.model.sys.book.GenreBookDto;
import com.a2m.back.model.sys.phieumuon.BorrowedBooksDto;
import com.a2m.back.service.comm.CommonService;
import com.a2m.back.service.qrcode.QrCodeService;
import com.a2m.back.service.sys.Sys0101Service;
import com.a2m.back.service.sys.book.Sys0201Service;
import com.a2m.back.service.sys.book.Sys0203Service;

@Service
public class Sys0201ServiceImpl implements Sys0201Service {

	@Autowired
	Sys0201DAO sys0201DAO;

	@Autowired
	Sys0202DAO sys0202DAO;

	@Autowired
	Sys0203DAO sys0203DAO;

	@Autowired
	Sys0204DAO sys0204DAO;

	@Autowired
	Sys0301DAO sys0301DAO;

	@Autowired
	Sys0203Service sys0203Service;

	@Autowired
	Sys0101Service sys0101Service;

	@Autowired
	User0105DAO user0105DAO;

	@Autowired
	private ResourceLoader resourceLoader;

	@Autowired
	private QrCodeService qrCodeService;
	
	@Autowired
    private CommonService commonService;

	@Override
	public List<BookResponse> getBooksWithStatus(int size, String search, int page, int status, int type, String sort) {
		List<BookResponse> books = new ArrayList<BookResponse>();
		books = sys0201DAO.getBooksWithStatus(size, (page - 1) * size, search, status, type, sort);
		for (int i = 0; i < books.size(); i++) {
			books.get(i).setQuantity(sys0201DAO.countBooksAvailable(books.get(i).getBookCode()));
			books.get(i).setImages(sys0204DAO.getImagesByBookCode(books.get(i).getBookCode(), 1));

		}
		return books;
	}
	@Override
	public int countBooksWithStatus(int size, String search, int page, int status, int type) {
		int result  = sys0201DAO.countBooksWithStatus(search, status,  type);
		return result;
	}
	@Override
	public List<BookResponse> getBooksLimit(int size, String page, String search, String category, 
			int[] listCategory, String[] listAuthor, String categoryByName, String[] type) {
		List<BookResponse> books = new ArrayList<BookResponse>();
		if (category.equals("0")) {
			category = "";

		}
		if (categoryByName == null) {
			categoryByName = "";

		}

		int startIndex = (Integer.parseInt(page) - 1) * size;

		books = sys0201DAO.getBooksLimit(size, ((Integer.parseInt(page)) - 1) * size, search, category, listAuthor, categoryByName, type);

//		if (search.equals("")) {
//			Pageable pageable = PageRequest.of(0, 8); // Limit to 5 records
//			Page<BookResponse> bookPage = bookResponRespo.findAll(pageable);
//			// thêm new ArrayList mới có thể Collections.sort()
//			books = new ArrayList<>(bookPage.getContent());
//		} else {
//			Pageable pageable = PageRequest.of(0, 8); // Limit to 5 records
//			Page<BookResponse> bookPage = bookResponRespo.findByTitle(search, pageable);
//			// thêm new ArrayList mới có thể Collections.sort()
//			books = new ArrayList<>(bookPage.getContent());
//		}
		
		
		for (BookResponse x : books) {
			x.setQuantity(sys0203DAO.getBookAvailableNumber(x.getBookCode()));
			x.setImages(sys0204DAO.getImagesByBookCode(x.getBookCode(), 1));
		}

		Collections.sort(books, new Comparator<BookResponse>() {
			@Override
			public int compare(BookResponse book1, BookResponse book2) {
				return Integer.compare(book2.getQuantity(), book1.getQuantity());
			}
		});

		return books;
//		if (startIndex + size < books.size()) {
//			return books.subList(startIndex, startIndex + size);
//		} else {
//			return books.subList(startIndex, books.size());
//		}
	}

	@Override
	public boolean updateBook(BookTitle book) {

		if (sys0201DAO.checkBookExist(book) == 0) {
			sys0201DAO.updateBook(book);
			sys0201DAO.deleteBookGenre(book.getBookCode());
			List<GenreBookDto> genres = book.getGenres();
			for (int i = 0; i < genres.size(); i++) {
				sys0201DAO.addBookGenre(book.getBookCode(), genres.get(i).getGenre_id());
			}
			return true;
		}
		return false;
	}

	@Override
	public BookResponse getBookInfo(String bookCode) {
		BookResponse book = sys0201DAO.getBookInfo(bookCode);
//		BookResponse book = bookResponRespo.findById(bookCode).get();
//		book.setQuantity(sys0203DAO.getBookAvailableNumber(book.getBookCode()));
		book.setGenres(sys0202DAO.getGenreByBookCode(bookCode));
		book.setQuantity(sys0201DAO.countBooksAvailable(book.getBookCode()));
		book.setImages(sys0204DAO.getImagesByBookCode(bookCode, 1));
		
		book.setEval(user0105DAO.getAllByBookCode(bookCode));
		int sumStar = 0;
		for (EvaluationResponse x : book.getEval()) {
			x.setUserInfo(sys0101Service.getUserInfoByUserUid(x.getUser_uid()));
			x.setImages(sys0204DAO.getImagesByEvaluateId(x.getEvaluate_id() + "", 1));
			sumStar += x.getStar();
		}
		if (book.getEval().size() > 0) {
			book.setRating(sumStar / book.getEval().size());

		}
//		nếu sách đang hoạt động và số lượng hiện có bằng 0 
//		(tức sách đang trong phiếu chờ hoặc mượn)
//		thì tìm thời gian sớm nhất có sách
		if (book.getStatus().equals("1") && book.getQuantity() == 0) {
			book.setEstimateTimeHave(getEstimateTimeHaveOfBook(book.getBookCode()));
		} else if (book.getStatus().equals("1")) {
			book.setEstimateTimeHave(CommonConstants.BOOK_STATUS_OK);
		} else if (book.getStatus().equals("0")) {
			book.setEstimateTimeHave(CommonConstants.BOOK_STATUS_NG);
		}
		return book;
	}

	public String genBookCode() {
		String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		int KEY_LENGTH = 4;
		SecureRandom secureRandom = new SecureRandom();
		StringBuilder sb = new StringBuilder(KEY_LENGTH);
		sb = new StringBuilder(KEY_LENGTH);
		while (sb.length() < KEY_LENGTH) {
			int randomIndex = secureRandom.nextInt(CHARACTERS.length());
			char randomChar = CHARACTERS.charAt(randomIndex);
			sb.append(randomChar);
		}
		return sb.toString();
	}

	public String genBookCode2(BookTitle book) {
		String code = "";
		// code theo dạng [type1][type2]
		String type1 = "";
		
		String genreName = book.getGenres().get(0).getGenre_name().toUpperCase();
		String[] words = genreName.split("\\s+");
		 for (String word : words) {
	            if (!word.isEmpty()) {
	                char firstLetter = word.charAt(0);
	                type1 +=  firstLetter + "";
	            }
	        }
		code +=  type1;
		
//		int count = (int) bookResponRespo.count();
		int count = (int) sys0201DAO.countTotalBookTitle("", "", null, "",  null);

		int desiredLength =  8;
		code = String.format("%s%0" + (desiredLength- code.length()) + "d", type1, count + 1);
		return code; 
	}

	@Override
	public BookTitle addBookTitle(BookTitle book, int quantity) {
		try {
			if (sys0201DAO.checkBookExist(book) == 0) {
				book.setBookCode(genBookCode2(book));
				book.setDateAdd(new Date());
				while (sys0201DAO.getBookInfo(book.getBookCode()) != null)
					book.setBookCode(genBookCode());
				sys0201DAO.addBookTitle(book);

				List<GenreBookDto> genres = book.getGenres();
				for (int i = 0; i < genres.size(); i++) {
					sys0201DAO.addBookGenre(book.getBookCode(), genres.get(i).getGenre_id());
				}
				sys0203Service.addBooksByBookCode(book.getBookCode(), quantity);

//				//tạo mã qr
//				OutputStream object = new FileOutputStream("");
//				qrCodeService.generateQr(book.getBookCode(), object);
				qrCodeService.generateQr(book.getBookCode());

				return book;
			}
			return new BookTitle();
		} catch (Exception e) {
			e.printStackTrace();
			return new BookTitle();
		}
	}

	@Override
	public void changeStatus(String bookCode, int status) {
		BookTitle book = new BookTitle();
		book.setBookCode(bookCode);
		book.setStatus(status);
		sys0201DAO.changeStatus(book);
		List<Book> bookList = new ArrayList<Book>();
		bookList = sys0203DAO.getBooksByBookCode(bookCode);
		for (Book x : bookList) {
			x.setStatus(status);
			sys0203DAO.changeBookStatus(x);
		}
	}

	@Override
	public int countTotalBookTitle(String search, String category, String[] listAuthor, 
			String categoryByName, String[] type) {
		if (category.equals("0")) {
			category = "";

		}
		if (categoryByName == null) {
			categoryByName = "";

		}

		int result = 0;

		result = sys0201DAO.countTotalBookTitle(search, category, listAuthor,  categoryByName, type);

		return result;
	}

	@Override
	public List<BookTitle> getBookTitleByGenre(int genre_id, int page) {
		int ignore = (page - 1) * 5;
		List<BookTitle> listBookTitle = sys0201DAO.getBookTitleByGenre(genre_id, ignore);

//		books = sys0201DAO.getBooksLimit(((Integer.parseInt(page)) - 1) * 12, search, category, author);
		for (BookTitle x : listBookTitle) {
			x.setQuantity(sys0203DAO.getBookAvailableNumber(x.getBookCode()));
			x.setImages(sys0204DAO.getImagesByBookCode(x.getBookCode(), 1));
		}
		return listBookTitle;
	}

	@Override
	public String getBookCover(String fileName) {
		String base64Image = "";
		try {
			Path imagePath = null;
			if (fileName.equals("no-image.png"))
				imagePath = Paths.get("src/main/resources/assets/images/no-image.png");
			else
				imagePath = Paths.get("src/main/resources/assets/images/book/title/" + fileName);
			byte[] imageBytes = Files.readAllBytes(imagePath);
			base64Image = Base64.getEncoder().encodeToString(imageBytes);
			return base64Image;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return base64Image;

	}

	@Override
	public List<String> getAuthor() {
		List<String> listAuthor = sys0201DAO.getAuthor();
		return listAuthor;
	}

	@Override
	public void changeStatusEbook(String bookCode, String status) {
		sys0201DAO.changeStatusEbook(bookCode, status);
	}

	@Override
	public String getEstimateTimeHaveOfBook(String bookCode) {
		String result = "";
		// xác định sách đang trong phiếu mượn hay không,
		// nếu không tức các sách đều đang trong phiếu chờ
		List<BorrowedBooksDto> listSachMuon = sys0203DAO.getBorrowedBookByBookCode(bookCode, 1);
		if (listSachMuon.size() == 0) {
			return CommonConstants.BOOK_STATUS_WN;
		}
		// sách đang nằm trong phiếu đang cho mượn, xác định được ngày dự kiến sẽ trả
		else {
			// xác định các phiếu mượn có đầu sách này
			List<phieumuonResponse> listPhieuMuon = new ArrayList<phieumuonResponse>();
			for (BorrowedBooksDto x : listSachMuon) {
				listPhieuMuon.add(sys0301DAO.getPhieuMuonByIdPhieuMuon(x.getID_PHIEU_MUON()));
			}

			Date earliestDate = new Date();
			earliestDate = listPhieuMuon.get(0).getReturnDateEstimate();
			// xác định ngày sớm nhất có sách
			for (phieumuonResponse x : listPhieuMuon) {
				if (x.getReturnDateEstimate().before(earliestDate)) {
					earliestDate = x.getReturnDateEstimate();
				}
			}
			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			result = dateFormat.format(earliestDate);
		}
		return result;
	}
	
	@Override
	public int addAccess(String bookCode) throws Exception {
		String userUid =  "0";
		try {
			 userUid = commonService.getUserUid();
		}
		catch(Exception e){
			userUid = "0";
		}
		
		int result = 0;
		if(sys0201DAO.checkRecordExist(bookCode, userUid)) {
			result =  sys0201DAO.addAccess(bookCode, userUid, 1);
		}
		else {
			result =  sys0201DAO.addAccess(bookCode, userUid, 0);
		}
		return result;
	}

	

}