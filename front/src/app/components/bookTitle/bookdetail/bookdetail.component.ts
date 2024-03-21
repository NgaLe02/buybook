import { PagesComponent } from "./../../../pages/pages.component";
import { ProductService } from "src/app/_service/services/product.service";
import { DauSach, Sach } from "src/app/_model/models/book.model";
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { DataResponse } from "src/app/_model/resp/data-response";
import { CommonConstant } from "src/app/_constant/common.constants";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { GenreBook } from "src/app/_model/models/genreBook.model";
import { ImageObject } from "../addbooktitle/addbooktitle.component";
import { ToastrService } from "ngx-toastr";

declare let $: any;

@Component({
  selector: "sys-bookdetail",
  templateUrl: "./bookdetail.component.html",
  styleUrls: ["./bookdetail.component.scss"],
})
export class SysBookDetailComponent implements OnInit {
  // id: number;
  product;
  bookTitle: DauSach;
  thumbimages: any[] = [];
  id: string = "";
  quantity: number = 1;
  bookList: Sach[] = [];
  status: number = 1;
  imageSrc: any;
  bookActiveNumber: number = 0;

  public Editor = ClassicEditor;
  @Input() readonly: boolean = true;

  editorConfig = {
    placeholder: "Type here..",
    toolbar: [],
  };

  imageObjectPreview: ImageObject[] = [];
  imageObject: ImageObject[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dauSach: DauSachService,
    private router: Router,
    private fileService: FileService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    // this.id = '' + this.activatedRoute.snapshot.paramMap.get('bookCode');

    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get("bookCode") ?? "";
    });

    this.dauSach.getBookTitleDetail(this.id).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK)
          this.bookTitle = resp.responseData as DauSach;
        this.bookTitle.bookCode = this.id;
        // gán giá trị của thuộc tính genres trong đối tượng this.bookTitle
        //  cho biến this.selectedGenre và đảm bảo rằng
        //  giá trị không bao giờ là null hoặc undefined.

        this.bookTitle.imagesSrc = [];
        if (this.bookTitle.images.length > 0) {
          for (let j = 0; j < this.bookTitle?.images?.length; j++) {
            let imgSrc = this.fileService.getFile(
              this.bookTitle.images[j].path
            );
            this.bookTitle.imagesSrc?.push(imgSrc);
            if (this.bookTitle.images[j].about === 2) {
            } else if (this.bookTitle.images[j].about === 0) {
              this.imageObject.push({
                image: imgSrc,
                thumbImage: imgSrc,
              });
            }
          }
        } else {
          this.bookTitle.images[0].path = "no-image.png";
        }

        this.imageObjectPreview = [];
        this.imageObjectPreview.push(this.imageObject[0]);
      },
      error: (err: any) => {},
    });
    this.dauSach.getBooksByBookCode(this.id).subscribe((response) => {
      if (response.status === CommonConstant.RESULT_OK) {
        this.bookList = response.responseData;
        for (let item of this.bookList) {
          if (item.status === 1) this.bookActiveNumber++;
        }
      }
    });
  }

  addBooks() {
    if (this.quantity > 0)
      this.dauSach.addBook(this.id, this.quantity).subscribe((response) => {
        if (response.status === CommonConstant.RESULT_OK) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Thêm sách thành công",
          }).then(() => {
            window.location.reload();
            // const url = '/sys/list-dausach/detail/'+ this.id
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //   this.router.navigateByUrl(url);
            // });
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Có lỗi trong việc thêm sách",
          });
        }
      });
  }

  getData() {}

  setStatus(status: number) {
    this.status = status;
  }

  handleMinus() {
    if (this.quantity > 0) this.quantity--;
  }
  handlePlus() {
    this.quantity++;
  }

  enableBook(book: Sach) {
    Swal.fire({
      icon: "info",
      title: "Xác nhận",
      text: "Bạn có muốn kích hoạt quyển sách này không?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dauSach.changeStatus(1, book.bookId).subscribe((response) => {
          if (response.status === CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Kích hoạt sách thành công",
            }).then(() => {
              this.reloadCurrentRoute();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Có lỗi trong việc kích hoạt sách",
            });
          }
        });
      }
    });
  }

  disableBook(book: Sach) {
    Swal.fire({
      icon: "info",
      title: "Confirm",
      text: "Bạn có muốn vô hiệu hóa quyển sách này không?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dauSach.changeStatus(0, book.bookId).subscribe((response) => {
          if (response.status === CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Vô hiệu hóa sách thành công",
            }).then(() => {
              this.reloadCurrentRoute();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Có lỗi trong việc vô hiệu hóa sách",
            });
          }
        });
      }
    });
  }

  enableBookTitle(bookCode: any) {
    Swal.fire({
      icon: "info",
      title: "Xác nhận",
      text: "Bạn có muốn kích hoạt đầu sách này không?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dauSach
          .changeBookTitleStatus(bookCode, 1)
          .subscribe((response) => {
            if (response.status === CommonConstant.RESULT_OK) {
              Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Kích hoạt đầu sách thành công",
              }).then(() => {
                this.reloadCurrentRoute();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Có lỗi trong việc kích hoạt sách",
              });
            }
          });
      }
    });
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  disableBookTitle(bookCode: any) {
    Swal.fire({
      icon: "info",
      title: "Xác nhận",
      text: "Bạn có muốn vô hiệu hóa đầu sách này không?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dauSach
          .changeBookTitleStatus(bookCode, 0)
          .subscribe((response) => {
            if (response.status === CommonConstant.RESULT_OK) {
              Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Vô hiệu hóa đầu sách thành công",
              }).then(() => {
                this.reloadCurrentRoute();
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Có lỗi trong việc vô hiệu hóa sách",
              });
            }
          });
      }
    });
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([uri]);
    });
  }

  genreNav(genre: GenreBook) {
    this.router.navigate(["/home"], {
      queryParams: { category: genre.genre_id, page: 1 },
    });
  }

  imageClickHandler(e) {
    this.imageObjectPreview = [];
    this.imageObjectPreview.unshift({
      image: this.imageObject[e].image,
      thumbImage: this.imageObject[e].thumbImage,
    });
  }
}
