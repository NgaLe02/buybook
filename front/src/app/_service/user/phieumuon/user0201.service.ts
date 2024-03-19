import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { DauSach } from 'src/app/_model/models/book.model';
import { phieumuonDto } from 'src/app/_model/models/phieumuonDto.model';
import { HeadersUtil } from 'src/app/_util/headers-util';

@Injectable({
    providedIn: 'root'
})
export class User0201Service {
    constructor(private http: HttpClient) { }
    // apiMessange: any;

    addPhieuMuon(bookList: DauSach[], phieumuon: phieumuonDto): Observable<any> {
        // console.log(phieumuon);
        const apiUrl = environment.backApiUrl + `/user/user0201/add`
        console.log("Adding books");
        const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
        // const jsonData = JSON.stringify(phieumuon);
        // console.log(phieumuon);
        return this.http.post(`${apiUrl}`, phieumuon, { headers });
    }

    checkPhieuMuonExists(): Observable<any> {
        const apiUrl = environment.backApiUrl + `/user/user0201/get/phieumuon`
        // console.log("Checking if phieumuon exists");
        const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
        return this.http.get(`${apiUrl}`, { headers });
    }
}
