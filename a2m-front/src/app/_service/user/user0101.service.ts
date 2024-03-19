import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, map } from "rxjs";
import { DauSach } from "src/app/_model/models/book.model";

@Injectable({
    providedIn: "root"
})
//cart
export class User0101Service {

    private booksSubject = new BehaviorSubject<DauSach[]>([]); 
    constructor(private http: HttpClient){
      
    }

    getBooks() {
        return this.booksSubject.asObservable(); // Trả về Observable để component có thể đăng ký lắng nghe
      }

    getListBookInCart(): Observable<any>{
        const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
        const url = environment.backApiUrl + '/user/cart/bookInCart';
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
        const url = environment.backApiUrl + '/user/cart/insert';
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
            const url = environment.backApiUrl + '/user/cart/delete';
            // return this.http.post<DataResponse>(url, book, { headers: headers });
            return this.http.post<DataResponse>(url, book, { headers: headers }).pipe(
                map(data => {
                  if (data.status === CommonConstant.RESULT_OK) {
                    const currentBooks = this.booksSubject.getValue();
                    const updateBooks = currentBooks.filter(p => p.bookCode !== book.bookCode);
                    this.booksSubject.next(updateBooks);
                  }
                  return data; // Trả về kết quả từ server
                })
              );
        }

}