import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FileService } from "src/app/_service/comm/file.service";
import { FileDetails } from 'src/app/_model/models/file-detail.model';



@Component({
  selector: 'app-upload-file',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class UploadFileComponent implements OnInit {

  file!: File;
  fileDetails!: FileDetails;
  fileUris: Array<string> = [];

  constructor(private fileUploadService: FileService, private router: Router) { }

  ngOnInit(): void {
    this.fileUris = ["http://localhost:8096/api/admin/sys0201/simple-form-upload-mvc/123"];
  }

  selectFile(event: any) {
    this.file = event.target.files.item(0);
  }

  uploadFile() {
    this.fileUploadService.uploadTest(this.file).subscribe({
      next: (data) => {
        this.fileDetails = data;
        this.fileUris.push(this.fileDetails.fileUri);
        console.log(data);
        console.log(this.fileUris);
        alert("File Uploaded Successfully");
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

}
