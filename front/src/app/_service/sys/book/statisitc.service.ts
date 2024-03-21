import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataResponse } from "src/app/_model/resp/data-response";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StatisticService {
  constructor(private http: HttpClient) {}

  getBooksToStatistic(
    search: string,
    page: number,
    type: number
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/admin/sys0205/getStatisticBook";
    let params = new HttpParams()
      .set("search", search.valueOf())
      .set("page", page.toString())
      .set("type", type.toString());

    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }

  countBooksToStatistic(
    search: string,
    page: number,
    type: number
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/admin/sys0205/countStatisticBook";
    let params = new HttpParams()
      .set("search", search.valueOf())
      .set("type", page.toString())
      .set("page", page.toString());
    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }

  countUsersToStatistic(search: string, page: number): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/admin/sys0205/countUsersToStatistic";
    let params = new HttpParams()
      .set("search", search.valueOf())
      .set("page", page.toString());
    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }

  getUsersToStatistic(search: string, page: number): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/admin/sys0205/getStatisticUsers";
    let params = new HttpParams()
      .set("search", search.valueOf())
      .set("page", page.toString());
    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }

  getBookBorrowedOfUserToStatistic(
    userUid: string,
    type: number,
    search: string
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl +
      `/admin/sys0205/getBookBorrowedOfUser/${userUid}`;
    let params = new HttpParams()
      .set("search", search.toString())
      .set("type", type.toString());
    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }

  getUserBorrowOfBookToStatistic(
    bookCode: string,
    type: number,
    search: string
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0205/getUserBorrowOfBook/${bookCode}`;

    let params = new HttpParams()
      .set("search", search.toString())
      .set("type", type.toString());
    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }
}
