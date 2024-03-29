package com.a2m.back.model.resp;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class phieumuonResponse {
    private int idPhieuMuon;
    @NotNull
    private Long userUid;
    @NotNull
    private Date createdDate;
    private Date borrowDate;
    private Date borrowDateReal;
    private Date returnDateEstimate;
    private Date returnUpdateReal;
    private Date cancelDate;
    private String bookCode;
    @NotNull
    private int status;
//    private List<BookResponse> listBook ;
    private List<BorrowedBookResponse> listBook;
    private int extended_times;
    private UserResponse userInfo;
    private int countBook;
    private Long fine;
    private int statusBorrowDate;
}
