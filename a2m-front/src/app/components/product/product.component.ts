import { DauSach } from "src/app/_model/models/book.model";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { DataResponse } from "src/app/_model/resp/data-response";
import { CommonConstant } from "src/app/_constant/common.constants";
import { User0101Service } from "src/app/_service/user/user0101.service";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { ToastrService } from "ngx-toastr";
import { User0102Service } from "src/app/_service/user/user0102.service";
import Swal from "sweetalert2";
import { DataService } from "src/app/_service/comm/data.service";
import { FileService } from "src/app/_service/comm/file.service";
import { saveAs } from "file-saver";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { User0201Service } from "src/app/_service/user/phieumuon/user0201.service";
import { GenreBook } from "src/app/_model/models/genreBook.model";
import { ImageObject } from "../bookTitle/addbooktitle/addbooktitle.component";
import { MyUploadAdapter } from "../bookTitle/addbooktitle/UploadAdapter";

declare let $: any;

@Component({
  selector: "mg-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  imageObjectPreview: ImageObject[] = [];
  imageObject: ImageObject[] = [];

  imageObjectEvaluate: ImageObject[][] = [];
  // id: number;
  product;
  bookTitle: DauSach;
  // thumbimages: any[] = [];
  id: string = "";
  ebookSrc: string;
  // safeDescription: SafeHtml;
  comment: string = "";
  // public Editor = ClassicEditor;
  @Input() readonly: boolean = true;

  @ViewChild("quantity") quantityInput;

  public Editor = ClassicEditor;
  public EditorComment = ClassicEditor;

  urlEbook: SafeResourceUrl;

  imageToShowSrc: string;
  // @ViewChild('imageURL')
  //   imageURL: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authen: AuthenticationService,
    private dauSach: DauSachService,
    private user0101Service: User0101Service,
    private user0102Service: User0102Service,
    private user0201Service: User0201Service,
    private toast: ToastrService,
    private dataService: DataService,
    private router: Router,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {}

  editorConfig = {
    placeholder: "Type here..",
    toolbar: [],
  };

  editorConfigComment = {
    placeholder: "Type here..",
  };

  title = "ckeditorAngular10";

  ngOnInit(): void {
    this.id = "" + this.activatedRoute.snapshot.paramMap.get("id");
    this.dauSach.getBookTitleDetail(this.id).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK)
          this.bookTitle = resp.responseData as DauSach;
        this.bookTitle.bookCode = this.id;

        this.bookTitle.imagesSrc = [];
        if (this.bookTitle.images.length > 0) {
          for (let j = 0; j < this.bookTitle?.images?.length; j++) {
            let imgSrc = this.fileService.getFile(
              this.bookTitle.images[j].path
            );
            if (this.bookTitle?.images[j].about == 1) {
              this.ebookSrc = this.bookTitle?.images[j].path!;
            }
            if (this.bookTitle.images[j].about == 0) {
              this.imageObject.push({
                image: imgSrc,
                thumbImage: imgSrc,
              });
            } else {
            }
          }
          this.imageObjectPreview = [];
          // this.imageObjectPreview = this.imageObject;
          this.imageObjectPreview.push(this.imageObject[0]);
        }

        this.imageObjectEvaluate = [];

        if (this.bookTitle.eval) {
          this.bookTitle.eval.forEach((e, index) => {
            this.imageObjectEvaluate[index] = [];
            e.images?.forEach((img) => {
              this.imageObjectEvaluate[index].push({
                image: this.fileService.getFile(img.path),
                thumbImage: this.fileService.getFile(img.path),
              });
            });
          });
        }
      },
      error: (err: any) => {},
    });
  }

  onReady($event) {
    $event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  addBookToCart() {
    if (this.bookTitle.status === "0") {
      this.toast.error("Sách đã ngừng cung cấp!");
    } else {
      this.user0101Service.insert(this.bookTitle).subscribe((resp) => {
        if (resp.status == CommonConstant.RESULT_WN) {
          this.authen.logIn();
        } else if (resp.status == CommonConstant.RESULT_OK) {
          this.dauSach.getBookAvailable(this.id).subscribe(
            (response) => {
              if (response.responseData) {
                this.toast.success(resp.message);
              } else {
                this.toast.error("Hiện tại sách đã hết!");
              }
            },
            (error) => {}
          );
        } else if (resp.status == CommonConstant.RESULT_NG) {
          this.toast.error(resp.message);
        }
      });
    }
  }

  addBookToWaitList() {
    this.user0102Service.insert(this.bookTitle).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_WN) {
          this.authen.logIn();
        } else if (resp.status == CommonConstant.RESULT_OK) {
          this.toast.success(resp.message);
          // this.sse.connect()
        } else if (resp.status == CommonConstant.RESULT_NG) {
          this.toast.error(resp.message);
        }
        // else if()
      },
    });

    // this.sse.connect()
  }

  borrow() {
    this.user0201Service.checkPhieuMuonExists().subscribe((response) => {
      if (response.status === CommonConstant.RESULT_WN) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Bạn chưa đăng nhập, vui lòng đăng nhập trước khi mượn sách",
        }).then(() => {
          this.authen.logIn();
        });
      } else if (this.bookTitle.status === "0") {
        this.toast.error("Sách đã ngừng cung cấp!");
      } else {
        const phieumuonNumber = response.responseData;
        if (phieumuonNumber !== 0) {
          this.toast.error(
            "Bạn còn phiếu mượn đang trong trạng thái chờ! Bạn chỉ có thể có tối đa 1 phiếu ở trạng thái chờ"
          );
        } else {
          this.dauSach.getBookAvailable(this.id).subscribe(
            (response) => {
              if (response.responseData) {
                this.router.navigate(["/user/checkout"], {
                  state: { data: [this.bookTitle.bookCode] },
                });
              } else {
                this.toast.error("Hiện tại sách đã hết!");
              }
            },
            (error) => {}
          );
        }
      }
    });
  }

  navigateToHome(genreBook: GenreBook) {
    this.dataService.setNavigateToGenre(true);
    this.router.navigate(["/home"], {
      queryParams: { page: 1, category: genreBook.genre_id },
    });
  }

  navigateToHomeByAuthor(author: string) {
    this.router.navigate(["/home"], {
      queryParams: { page: 1, search1: author },
    });
  }

  genreNav(genre: GenreBook) {
    this.router.navigate(["/home"], {
      queryParams: { category: genre.genre_id, page: 1 },
    });
  }

  onDownloadFile(): void {
    if (this.bookTitle.bookCode) {
      this.fileService
        .download(this.ebookSrc)
        .subscribe((blob) => saveAs(blob, this.bookTitle.bookCode + ".pdf"));
    }
  }

  showBookOnline($event: any): void {
    // if (this.bookTitle.bookCode) {
    //   this.fileService.download(this.bookTitle.bookCode).subscribe(res => {
    //     let blob: Blob = res as Blob;
    //     let url = window.URL.createObjectURL(blob);
    //     window.open(url)
    //   });
    // }

    if (this.bookTitle.bookCode) {
      let url = this.fileService.getFile(this.ebookSrc);
      this.urlEbook = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  imageClickHandler(e) {
    console.log(e);
    this.activeImageIndex = e;
    this.imageObjectPreview = [];
    this.imageObjectPreview.unshift({
      image: this.imageObject[e].image,
      thumbImage: this.imageObject[e].thumbImage,
    });
  }

  activeImageIndex: number = 1;
  @ViewChild("nav") nav: any;

  onImageClick() {
    this.imageObjectPreview = [...this.imageObject];
  }

  closeImage() {
    this.imageObjectPreview = [];
    this.imageObjectPreview.unshift({
      image: this.imageObject[this.activeImageIndex].image,
      thumbImage: this.imageObject[this.activeImageIndex].thumbImage,
    });
  }
}
