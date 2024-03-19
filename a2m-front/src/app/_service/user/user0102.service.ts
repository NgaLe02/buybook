import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, map } from "rxjs";
import { SseService } from "../comm/sse.service";
import { DauSach } from "src/app/_model/models/book.model";


@Injectable({
    providedIn: "root"
})
//waitlist
export class User0102Service {

    private booksSubject = new BehaviorSubject<DauSach[]>([]); 

    constructor(private http: HttpClient,
      private sseService: SseService,){

    }

    getBooks() {
        return this.booksSubject.asObservable(); // Trả về Observable để component có thể đăng ký lắng nghe
      }

    getListBookInWaitList(): Observable<any>{
        const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
        const url = environment.backApiUrl + '/user/waitlist/getBook';
        // return this.http.get<DataResponse>(url, { headers: headers });
        return this.http.get<DataResponse>(url, { headers: headers }).pipe(
            map(data => {
              if (data.status === CommonConstant.RESULT_OK) {
                this.booksSubject.next(data.listResponseData as DauSach[]); // Cập nhật danh sách sản phẩm
              }
            //   return data; // Trả về kết quả từ server
            })
          );
    }

    insert(book: DauSach): Observable<any>{
        const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
        const url = environment.backApiUrl + '/user/waitlist/insert';
        // return this.http.post<DataResponse>(url, book, { headers: headers });
        return this.http.post<DataResponse>(url, book, { headers: headers }).pipe(
            map(data => {
                if (data.status === CommonConstant.RESULT_OK) {
                    const currentBooks = this.booksSubject.getValue(); // Lấy danh sách sản phẩm hiện tại
                    const updatedBooks = [...currentBooks, book]; // Thêm sản phẩm mới vào danh sách
                    this.booksSubject.next(updatedBooks); // Cập nhật danh sách mới
                }
                return data; 
            })
            
          );
    }

    delete(book: DauSach): Observable<any>{
        const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
        const url = environment.backApiUrl + '/user/waitlist/delete';
        // return this.http.post<DataResponse>(url, book, { headers: headers });
        return this.http.post<DataResponse>(url, book, { headers: headers }).pipe(
            map(data => {
              if (data.status === CommonConstant.RESULT_OK) {
                const currentBooks = this.booksSubject.getValue();
                const updateBooks = currentBooks.filter(p => p.bookCode !== book.bookCode);
                this.booksSubject.next(updateBooks);
                // this.sseService.disconnect()
              }
              return data; // Trả về kết quả từ server
            })
          );
    }

}