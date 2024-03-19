import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {FileService } from "src/app/_service/comm/file.service";
import { FileDetails } from 'src/app/_model/models/file-detail.model';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HeadersUtil } from "src/app/_util/headers-util";

  
@Component({
    selector: 'app-upload-file',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
  })
  export class UploadFileComponent implements OnInit {
  
    file!: File;
    fileDetails!: FileDetails;
    fileUris: Array<string> = [];
    @ViewChild('imageURL')
    imageURL: ElementRef;

    constructor(private fileUploadService: FileService, private router: Router, private http: HttpClient) { }
  
    ngOnInit(): void {
      this.fileUris = ["http://localhost:8096/image/123.png"]
    }
  
    selectFile(event: any) {
      this.file = event.target.files.item(0);
    }
    getImageURL() {
      this.fileUploadService.getPdf("").subscribe((responseMessage : any) => {
        let file = new Blob([responseMessage], {type:'application/jpeg'});
        var fileUrl = URL.createObjectURL(file);
        this.imageURL.nativeElement.src = fileUrl;
      })
    }
  
    uploadFile() {
      this.fileUploadService.uploadTest(this.file).subscribe({
        next: (data) => {
          this.fileDetails = data;
          this.fileUris.push(this.fileDetails.fileUri);
          console.log(data)
          console.log(this.fileUris)
          alert("File Uploaded Successfully")
        },  
        error: (e) => {
          console.log(e);
        }
      });
    }
  
  }