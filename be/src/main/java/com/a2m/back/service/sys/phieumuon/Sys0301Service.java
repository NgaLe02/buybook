package com.a2m.back.service.sys.phieumuon;

import java.util.List;

import com.a2m.back.model.resp.phieumuonResponse;

public interface Sys0301Service {
    List<phieumuonResponse> getAllPhieuMuon(int STATUS);
    List<phieumuonResponse> getPhieuMuonInfo(String USER_UID, int STATUS);
    phieumuonResponse getDetailPhieuMuon(String USER_UID, int STATUS);
    void xacNhan(int STATUS, int idPhieuMuon, List<String> listIdSelectedBook) throws Exception ;
    List<String> getAllUserUid(int STATUS);
    Integer getCountBook (int idPhieuMuon);
    int getQuantityPhieuOfUser(String userUid);
    List<phieumuonResponse> selectByPagination(int STATUS, String page, int statusBorrowDate, String search);
    List<phieumuonResponse> selectPhieuMuonByUsername(int status, String username);
    Integer getCountPhieuByStatus(int status);

    Integer getCountPhieuByStatusAndUserUid(int status, String userUid);
}

