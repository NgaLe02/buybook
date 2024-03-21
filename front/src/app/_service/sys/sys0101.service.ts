import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { Observable } from "rxjs";
import { AuthConstant } from "src/app/_constant/auth.constant";
import { DataResponse } from "src/app/_model/resp/data-response";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { UserInfo } from "src/app/_model/auth/user-info";

@Injectable({
  providedIn: "root",
})
export class Sys0101Service {
  constructor(private http: HttpClient) {}

  getListUser(
    status: string,
    page: number,
    username: string
  ): Observable<DataResponse> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0101/listUserInfo/${status}`;
    let params = new HttpParams()
      .set("search", username.valueOf())
      .set("page", page.toString());
    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }

  countListUser(
    status: string,
    page: number,
    username: string
  ): Observable<DataResponse> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0101/countListUserInfo/${status}`;
    let params = new HttpParams()
      .set("search", username.valueOf())
      .set("page", page.toString());
    return this.http.get<DataResponse>(url, {
      headers: headers,
      params: params,
    });
  }
  //   const url = environment.backApiUrl + `/admin/sys0301/phieumuon/${status}`;

  getUserByUserUid(userUid: String): Observable<UserInfo> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + `/admin/sys0101/userInfo/${userUid}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getCountUser(): Observable<DataResponse> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + `/admin/sys0101/count`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }

  getListUserByUserid(userId: string): Observable<DataResponse> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/admin/sys0101/searchByUserId/${userId}`;
    return this.http.get<DataResponse>(url, { headers: headers });
  }
}
