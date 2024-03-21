import { Evaluation } from "./../../_model/models/evaluation.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, map } from "rxjs";
import { DauSach } from "src/app/_model/models/book.model";

@Injectable({
  providedIn: "root",
})
//cart
export class User0105Service {
  // private booksSubject = new BehaviorSubject<DauSach[]>([]);
  constructor(private http: HttpClient) {}

  insert(evaluation: Evaluation): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/user/evaluate/insert";

    return this.http.post<DataResponse>(url, evaluation, { headers: headers });
  }

  insertFiles(formData: FormData) {
    const apiUrl = environment.backApiUrl + `/user/evaluate/insertFile`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover();

    return this.http.post(`${apiUrl}`, formData, {
      headers: headers,
    });
  }

  getEvaluateOfBook(sachMuonId: string): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url =
      environment.backApiUrl + `/user/evaluate/getEvaluateOfBook/${sachMuonId}`;

    return this.http.get<DataResponse>(url, { headers: headers });
  }

  update(evaluation: Evaluation): Observable<any> {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + "/user/evaluate/update";

    return this.http.put<DataResponse>(url, evaluation, { headers: headers });
  }
}
