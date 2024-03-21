import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HeadersUtil } from "src/app/_util/headers-util";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { FileDetails } from "src/app/_model/models/file-detail.model";

@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private http: HttpClient) {}

  // // define function to upload files
  upload(formData: FormData): Observable<any> {
    const url = environment.backApiUrl + "/admin/sys0201/uploadEbook";
    const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover();
    return this.http.post(url, formData, { headers });
  }

  // define function to download files
  download(filename: string) {
    const url = environment.backApiUrl + `/public/download/${filename}`;
    const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover();
    return this.http.get(url, {
      headers,
      responseType: "blob",
    });
    // return this.http.get(`${this.server}/file/download/${filename}/`, {
    //     reportProgress: true,
    //     observe: 'events',
    //     responseType: 'blob'
    // });
  }

  generateQrCode(data: string) {
    const url = environment.backApiUrl + "/admin/sys0201/qr/generate";
    const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover();

    return this.http.post(url, data, { headers });
  }

  // getPdf(fileName: string) {
  //     // const apiURL = 'http://localhost:8096/api/admin/sys0201/simple-form-upload-mvc/123'; // Thay YOUR_API_URL bằng URL của API của bạn
  //     // const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover()
  //     // return this.http.get(apiURL, { responseType: 'blob', headers });

  //     return environment.backApiUrl + `/public/getPdf/${fileName}`
  // }

  getFile(fileName: any) {
    // if (!fileName) return "";
    return environment.backApiUrl + `/public/getFile/${fileName}`;
  }
}

export { FileDetails };
