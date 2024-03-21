import { DauSach } from "./book.model";

export class SachMuon extends DauSach {
  sachMuonId?: number;
  ID_PHIEU_MUON?: number;
  bookId?: string;
  bookCodeBorrowBook?: string;
  statusBorrowBook?: number;
  //   required?: number;
  evaluate?: number;
}
