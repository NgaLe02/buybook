import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataResponse } from 'src/app/_model/resp/data-response';
import { phieumuonDto } from 'src/app/_model/models/phieumuonDto.model';
import { HeadersUtil } from 'src/app/_util/headers-util';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class User0203Service {

  constructor(private http: HttpClient) { }

  extendReturnDate(phieumuon: phieumuonDto) {
    const headers: HttpHeaders = HeadersUtil.getHeadersAuth();
    const url = environment.backApiUrl + `/user/user0203/phieumuon/extend`;
    return this.http.post<DataResponse>(url, phieumuon, { headers: headers });
  }
}
