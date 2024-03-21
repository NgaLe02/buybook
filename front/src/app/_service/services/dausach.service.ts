import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, isEmpty, map } from "rxjs";
import { ajax } from "rxjs/ajax";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { DauSach } from "src/app/_model/models/book.model";
import { HeadersUtil } from "src/app/_util/headers-util";
import { DataResponse } from "src/app/_model/resp/data-response";
import { CommonConstant } from "src/app/_constant/common.constants";
import { AbstractControl } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class DauSachService {
  private totalBookSubject = new BehaviorSubject<Number>(0);
  private bookSubject = new BehaviorSubject<DauSach[]>([]);

  constructor(private http: HttpClient) {}
  apiMessange: any;
  postData(dausach: DauSach, quantity: number): Observable<any> {
    const apiUrl =
      environment.backApiUrl + `/admin/sys0201/add?quantity=${quantity}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const jsonData = JSON.stringify(dausach);
    return this.http.post(`${apiUrl}`, jsonData, { headers });
  }
  getData(
    page: number,
    search: string,
    status: string,
    type: number,
    sort: string
  ): Observable<any> {
    const apiUrl = environment.backApiUrl + "/admin/sys0201/get";
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    let params = new HttpParams()
      .set("search", search.valueOf())
      .set("page", page.toString())
      .set("type", type.toString())
      .set("sort", sort.toString())
      .set("status", status.toString());
    return this.http.get(`${apiUrl}`, { headers: headers, params: params });
  }

  countGetData(
    page: number,
    search: string,
    status: string,
    type: number
  ): Observable<any> {
    const apiUrl = environment.backApiUrl + "/admin/sys0201/count";
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    let params = new HttpParams()
      .set("search", search.valueOf())
      .set("page", page.toString())
      .set("type", type.toString())
      .set("status", status.toString());
    return this.http.get(`${apiUrl}`, { headers: headers, params: params });
  }

  getBookDetail(bookCode: string): Observable<any> {
    const apiUrl = environment.backApiUrl + `/admin/sys0201/get/${bookCode}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.get(`${apiUrl}`, { headers });
  }

  changeStatus(status: any, bookId: string): Observable<any> {
    const apiUrl =
      environment.backApiUrl +
      `/admin/sys0203/status/${bookId}?status=${status}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.put(`${apiUrl}`, "", { headers });
  }

  changeBookTitleStatus(bookCode: string, status: any): Observable<any> {
    const apiUrl =
      environment.backApiUrl +
      `/admin/sys0201/status/${bookCode}?status=${status}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.put(`${apiUrl}`, "", { headers });
  }

  updateBookTitle(dausach: DauSach): Observable<any> {
    const apiUrl = environment.backApiUrl + `/admin/sys0201/update`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.put(`${apiUrl}`, dausach, { headers });
  }

  getBookData(bookCode: string): Observable<any> {
    const apiUrl = environment.backApiUrl + `/user/user0201/get/${bookCode}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.get(`${apiUrl}`, { headers });
  }

  addBook(bookCode: string, quantity: number): Observable<any> {
    const apiUrl =
      environment.backApiUrl +
      `/admin/sys0203/add/${bookCode}?quantity=${quantity}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.post(`${apiUrl}`, "", { headers });
  }

  getBookTitle(
    page: Number,
    title: string,
    category: number,
    listSearchCategory: number[],
    listSearchAuthor: string[],
    categoryByName: string,
    type: string[]
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/public/getBookTitle?page=" + page;
    let params = new HttpParams()
      .set("search", title.valueOf())
      .set("page", page.toString())
      .set("category", category)
      .set("categoryByName", categoryByName);

    listSearchCategory.forEach((item) => {
      params = params.append("listCategory", item);
    });

    listSearchAuthor.forEach((item) => {
      params = params.append("listAuthor", item);
    });

    type.forEach((item) => {
      params = params.append("type", item);
    });

    return this.http
      .get<DataResponse>(url, { headers: headers, params: params })
      .pipe(
        map((data) => {
          if (data.status === CommonConstant.RESULT_OK) {
            this.bookSubject.next(data.listResponseData as DauSach[]);
          }
        })
      );
  }

  getBookTitleDetail(bookCode: String): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + `/public/get/${bookCode}`;
    return this.http.get(url, { headers });
  }

  getBookAvailable(bookCode: string): Observable<any> {
    const apiUrl =
      environment.backApiUrl + `/user/user0201/available/${bookCode}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.get(`${apiUrl}`, { headers });
  }

  getBooksByBookCode(bookCode: string): Observable<any> {
    const apiUrl = environment.backApiUrl + `/admin/sys0203/get/${bookCode}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.get(`${apiUrl}`, { headers });
  }

  getBookTitleByGenre(genre_id: number, page: number): Observable<any> {
    const apiUrl = environment.backApiUrl + `/public/get/genre/${genre_id}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const params = new HttpParams().set("page", page);
    return this.http.get(`${apiUrl}`, { headers: headers, params: params });
  }

  countTotalBookTitle(
    title: string,
    category: number,
    listAuthor: string[],
    categoryByName: string
  ): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/public/countTotalBookTitle";
    let params = new HttpParams()
      .set("search", title.valueOf())
      .set("category", category)
      .set("categoryByName", categoryByName);

    listAuthor.forEach((item) => {
      params = params.append("listAuthor", item);
    });

    return this.http
      .get<DataResponse>(url, { headers: headers, params: params })
      .pipe(
        map((data) => {
          if (data.status === CommonConstant.RESULT_OK) {
            this.totalBookSubject.next(Number(data.responseData));
          }
        })
      );
  }

  getQuantityBooks() {
    return this.totalBookSubject.asObservable();
  }
  getBooks() {
    return this.bookSubject.asObservable();
  }

  addCover(formData: FormData, imageDeltete: string[]): Observable<any> {
    const apiUrl = environment.backApiUrl + `/admin/sys0201/add/cover`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover();

    let params = new HttpParams();

    imageDeltete.forEach((item) => {
      params = params.append("imageDelete", item);
    });

    return this.http.post(`${apiUrl}`, formData, {
      headers: headers,
      params: params,
    });
  }

  //sau  khi cos casc phiếu mượn cần bỏ hàm này mà dùng hàm bên fileService
  getCover(fileName: string): Observable<any> {
    const apiUrl = environment.backApiUrl + `/public/get/cover/${fileName}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover();
    return this.http.get(`${apiUrl}`);
  }

  getAuthorToFilter(): Observable<any> {
    const apiUrl = environment.backApiUrl + `/public/get/author`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.get(`${apiUrl}`, { headers });
  }

  addAccess(bookCode: string) {
    const apiUrl = environment.backApiUrl + `/public/add/access/${bookCode}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    return this.http.get(`${apiUrl}`, { headers });
  }
}
