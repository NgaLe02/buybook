import { GenreBook } from "./genreBook.model";
import { ImageBook } from "./imageBook.model";
export class DauSach {
  bookCode?: string;
  title?: string;
  publisher?: string;
  price?: number;
  pages?: number;
  description?: string;
  status?: string;
  author?: string;
  createdYear?: number;
  category?: number;
  img?: string;
  catsName?: string;
  genres?: GenreBook[];
  checked?: boolean;
  quantity?: number | 0;
  // dùng để lấy id sách mượn của đầu sách
  book_id?: string;
  sachMuon_id?: string;
  borrowDate?: Date;
  returnDateEstimate?: Date;
  returnUpdateReal?: Date;
  createdDate?: Date;
  ebook?: number;
  qrCodeImage?: string;
  images: ImageBook[];
  imagesSrc: string[];

  numberOfTimesBorrowed?: number;
  numberOfBorrowing?: number;
  numberOfLost?: number;
  numberOfTimesBorrowedOfUser?: number;
  numberOfLostOfUser?: number;

  estimateTimeHave?: string;

  // đầu sách có bắt buộc có không khi bạn đọc mượn phiếu
  required?: number;
}

export interface Sach {
  bookId?: any;
  bookCode?: any;
  status?: number;
  isAvailable?: number;
}
