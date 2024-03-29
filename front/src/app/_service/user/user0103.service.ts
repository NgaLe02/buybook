import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, map } from "rxjs";
import { GenreBook } from "src/app/_model/models/genreBook.model";

@Injectable({
    providedIn: "root"
})
//genreBook
export class User0103Service {

    private genreForUserSubject = new BehaviorSubject<GenreBook[]>([]);

    constructor(private http: HttpClient) {

    }


    getGenreForUser() {
        return this.genreForUserSubject.asObservable();
    }

    getListCateBookForUser(): Observable<any> {
        const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
        const url = environment.backApiUrl + '/user/genre/genreBookForUser';
        // return this.http.get<DataResponse>(url, { headers: headers });
        return this.http.get<DataResponse>(url, { headers: headers }).pipe(
            map(data => {
                if (data.status === CommonConstant.RESULT_OK) {
                    this.genreForUserSubject.next(data.listResponseData as GenreBook[]); // Cập nhật danh sách sản phẩm
                }
                //   return data; // Trả về kết quả từ server
            })
        );
    }

}