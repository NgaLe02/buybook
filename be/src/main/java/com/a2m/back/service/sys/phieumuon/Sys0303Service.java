package com.a2m.back.service.sys.phieumuon;

import java.util.List;

import com.a2m.back.model.resp.BorrowedBookResponse;
import com.a2m.back.model.resp.phieumuonResponse;

public interface Sys0303Service {
    List<BorrowedBookResponse> getAllBook(int idPhieuMuon);
    phieumuonResponse getDetailPhieuMuon(int idPhieuMuon);
    //status:
    //2: đã trả
    //4: trả muộn
    void changeStatusToReturnBook (int idPhieuMuon, int status);
    List<String> getListBookIdByIdPhieuMuon(int idPhieuMuon);
    void changeToDisable(String book_id, int idPhieuMuon);

}
