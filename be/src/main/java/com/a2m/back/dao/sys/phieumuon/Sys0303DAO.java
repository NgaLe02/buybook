package com.a2m.back.dao.sys.phieumuon;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.a2m.back.model.resp.BorrowedBookResponse;
import com.a2m.back.model.resp.phieumuonResponse;

@Mapper
public interface Sys0303DAO {
    List<BorrowedBookResponse> getAllBook(int idPhieuMuon);
    phieumuonResponse getDetailPhieuMuon(int idPhieuMuon);
    //status:
    //2: đã trả
    //4: trả muộn
    void changeStatusToReturnBook (int idPhieuMuon, long fine, int status);
    List<String> getListBookIdByIdPhieuMuon(int idPhieuMuon);
    void changeToDisable(String book_id, int idPhieuMuon);
    int getRequiredOfBookInPhieu(int idPhieuMuon, String bookCode);

}
