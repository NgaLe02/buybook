import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataResponse } from "src/app/_model/resp/data-response";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StatisticService {
  constructor(private http: HttpClient) {}

  getBooksToStatistic(): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/admin/sys0205/getStatisticBook";
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getUsersToStatistic(): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/admin/sys0205/getStatisticUsers";
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getBookBorrowedOfUserToStatistic(userUid: string): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl +
      `/admin/sys0205/getBookBorrowedOfUser/${userUid}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getUserBorrowOfBookToStatistic(bookCode: string): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0205/getUserBorrowOfBook/${bookCode}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }
}
