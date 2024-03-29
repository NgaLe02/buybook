import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class Sys0301Service {
  private genreSubject = new BehaviorSubject<phieumuonDto[]>([]);
  constructor(private http: HttpClient) {}

  getPhieuMuon() {
    return this.genreSubject.asObservable(); // Trả về Observable để component có thể đăng ký lắng nghe
  }
  getPhieuByStatus(status: number) {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + `/admin/sys0301/phieumuon/${status}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  countPhieuMuonOfUser(userUid: String) {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + `/admin/sys0301/count/${userUid}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  xacNhanPhieuMuon(idPhieuMuon: number, listSeletecBook: string[]) {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0301/phieumuon-status/${idPhieuMuon}`;
    return this.http.put<DataResponse>(url, listSeletecBook, {
      headers: headers,
    });
  }

  getListPhieuMuonLimit(
    status: number,
    page: Number,
    statusBorrowDate: number,
    search: string
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0301/phieumuon-pagination/${status}`;
    const params = new HttpParams()
      .set("page", page.valueOf())
      .set("statusBorrowDate", statusBorrowDate)
      .set("search", search);

    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }

  getPhieuByUsername(status: number, username: string) {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl +
      `/admin/sys0301/phieumuon/search/${status}?username=` +
      username;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getListPhieuMuonUserLimit(
    userUid: number,
    status: number,
    page: Number
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl +
      `/admin/sys0301/phieumuon/list-manage-user/${userUid}/${status}?page=` +
      page;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getDetailPhieuMuonUser(userUid: number, status: number): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl +
      `/admin/sys0301/phieumuon-user/${userUid}/${status}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getTotalPhieuByStatus(status: number) {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0301/count-by-status/${status}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getTotalPhieuByStatusAndUserUid(status: number, userUid: number) {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl +
      `/admin/sys0301/phieumuon/count/${userUid}/${status}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }
}
