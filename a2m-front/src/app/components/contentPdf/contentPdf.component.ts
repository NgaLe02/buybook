import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FileService } from "src/app/_service/comm/file.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { DataResponse } from "src/app/_model/resp/data-response";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DauSach } from "src/app/_model/models/book.model";

@Component({
  selector: "app-contentPdf",
  templateUrl: "./contentPdf.component.html",
  styleUrls: ["./contentPdf.component.scss"],
})
export class ContentPdf implements OnInit {
  id: string = "";
  urlEbook: SafeResourceUrl;

  bookTitle: DauSach;
  ebookSrc: string;
  imageToShowSrc: string[] = [];

  public data: DauSach[];

  constructor(
    private fileService: FileService,
    private dauSach: DauSachService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.id = "" + this.activatedRoute.snapshot.paramMap.get("id");

    this.dauSach.getBookTitleDetail(this.id).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.bookTitle = resp.responseData as DauSach;

          if (this.bookTitle.images.length > 0) {
            for (let j = 0; j < this.bookTitle?.images?.length; j++) {
              if (this.bookTitle?.images[j].about == 1) {
                this.ebookSrc = this.fileService.getFile(
                  this.bookTitle.images[j].path
                );
                break;
              }
            }
          }
          this.urlEbook = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.ebookSrc
          );
          //   window.open(url);
          this.dauSach.addAccess(this.id).subscribe();
        }
      },
      error: (err: any) => {},
    });

    // this.dauSach
    //   .getData(1, "", "1", 1, "")
    //   .pipe(
    //     map((response) => {
    //       this.data = [];
    //       this.data = response.responseData;
    //       for (let i = 0; i < this.data.length; i++) {
    //         this.data[i].imagesSrc = [];
    //         for (let j = 0; j < this.data[i]?.images?.length; j++) {
    //           let imgSrc = this.fileService.getFile(
    //             this.data[i].images[j].path
    //           );
    //           this.data[i].imagesSrc?.push(imgSrc);
    //         }
    //       }
    //       this.imageToShowSrc = [];
    //       for (let c of this.data) {
    //         for (let j = 0; j < c?.images.length; j++) {
    //           if (c.images[j].about === 0) {
    //             this.imageToShowSrc.push(c.imagesSrc[j]);
    //             break;
    //           }
    //         }
    //       }
    //     })
    //   )
    //   .subscribe();
  }
}
