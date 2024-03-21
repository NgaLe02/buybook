import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FileService } from "src/app/_service/comm/file.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { DataResponse } from "src/app/_model/resp/data-response";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DauSach } from "src/app/_model/models/book.model";
import { PageViewModeType } from "ngx-extended-pdf-viewer";

@Component({
  selector: "app-contentPdf",
  templateUrl: "./contentPdf2.component.html",
  styleUrls: ["./contentPdf.component.scss"],
})
export class ContentPdf2 implements OnInit {
  id: string = "";
  urlEbook: SafeResourceUrl;

  bookTitle: DauSach;
  ebookSrc: string;
  imageToShowSrc: string[] = [];

  public data: DauSach[];
  public pageViewMode: PageViewModeType = "multiple";
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
          //   this.urlEbook = this.sanitizer.bypassSecurityTrustResourceUrl(
          //     this.ebookSrc
          //   );
          console.log(this.ebookSrc);
          this.dauSach.addAccess(this.id).subscribe();
        }
      },
      error: (err: any) => {},
    });
  }
}
