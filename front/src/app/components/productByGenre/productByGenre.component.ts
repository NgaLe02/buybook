import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { AuthConstant } from "src/app/_constant/auth.constant";
import { Cookie } from "ng2-cookies";
import { DauSach, Sach } from "src/app/_model/models/book.model";
import { forkJoin, map } from "rxjs";
import { FileService } from "src/app/_service/comm/file.service";
@Component({
  selector: "mg-product-by-genre",
  templateUrl: "./productByGenre.component.html",
  styleUrls: ["./productByGenre.component.scss"],
})
export class ProductByGenreComponent implements OnInit {
  // products: ProductModelServer[] = [];
  isAuthenticate: boolean = false;
  inputText: string = "";
  listBookTitle: DauSach[] = [];
  genre_id: number;
  imageArray: string[] = [];

  public data: DauSach[];
  public bookdata: Sach[];
  formModalDetail: any;
  formModalDisable: any;
  formModalEnable: any;
  disableBookCode: string;
  enableBookCode: string;
  genre_list: string;
  dausachDetail: DauSach = {
    bookCode: "",
    title: "",
    publisher: "",
    price: 0,
    pages: 0,
    description: "",
    status: "0",
    author: "",
    createdYear: 0,
    category: 0,
    numberAccess: 0,
    img: "",
    genres: [],
    images: [],
    imagesSrc: [],
  };
  quantity: 0;

  //pagination
  pageCurrent: number = 1;
  maxPage: number = 2;
  tableSize: number = 5;

  imageToShowSrc: string[] = [];

  constructor(
    private authen: AuthenticationService,
    private router: Router,
    private dauSach: DauSachService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {}

  showBookDetail(book: DauSach) {
    this.router.navigate(["/home/book", book.bookCode]).then(() => {});
  }

  ngOnInit(): void {
    this.genre_id = Number(this.activatedRoute.snapshot.paramMap.get("id"));
    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      this.isAuthenticate = true;
    }
    // this.getBookTitle();

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
      // this.statusSearch = (param.get("status")) ?? ""
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }
      this.getBookTitle();
    });
  }

  getBookTitle() {
    this.dauSach
      .getBookTitleByGenre(this.genre_id, this.pageCurrent)
      .pipe(
        map((response) => {
          this.listBookTitle = [];
          this.listBookTitle = response.responseData;
          let subscribeList: any[] = [];
          for (let i = 0; i < this.listBookTitle.length; i++) {
            this.listBookTitle[i].imagesSrc = [];
            if (this.listBookTitle[i].images) {
              for (let j = 0; j < this.listBookTitle[i]?.images.length; j++) {
                let imgSrc = this.fileService.getFile(
                  this.listBookTitle[i].images[j].path
                );
                this.listBookTitle[i].imagesSrc?.push(imgSrc);
              }
            } else {
              subscribeList.push(this.fileService.getFile("no-image.png"));
            }
          }

          this.imageToShowSrc = [];
          for (let i = 0; i < this.listBookTitle.length; i++) {
            if (this.listBookTitle[i].images) {
              for (let j = 0; j < this.listBookTitle[i]?.images.length!; j++) {
                if (this.listBookTitle[i].images[j].about === 0) {
                  this.imageToShowSrc.push(this.listBookTitle[i].imagesSrc[j]);
                  break;
                }
              }
            }
          }
        })
      )
      .subscribe();
  }

  openModel(item: DauSach) {
    if (item.bookCode) {
      this.dauSach.getBookDetail(item.bookCode).subscribe(
        (response) => {
          this.dausachDetail = response.responseData;
        },
        (error) => {}
      );
    }
    if (this.dausachDetail.genres) {
      this.genre_list = this.dausachDetail.genres
        .map((item) => item.genre_name)
        .join(", ");
    }
    // this.dausachDetail = item;
    if (item.bookCode) {
      this.dauSach.getBookData(item.bookCode).subscribe(
        (response) => {
          this.bookdata = response.responseData;
        },
        (error) => {}
      );
    }

    this.formModalDetail.show();
  }

  closeModel() {
    this.formModalDetail.hide();
  }

  openModelDisable(bookCode: string) {
    this.disableBookCode = bookCode;
    this.formModalDisable.show();
  }

  closeModelDisable() {
    this.disableBookCode = "";
    this.formModalDisable.hide();
  }
  disable() {
    this.dauSach.changeStatus(0, this.disableBookCode).subscribe();
    this.formModalDisable.hide();
    window.location.reload();
  }

  openModelEnable(bookCode: string) {
    this.enableBookCode = bookCode;
    this.formModalEnable.show();
  }

  closeModelEnable() {
    this.enableBookCode = "";
    this.formModalEnable.hide();
  }

  enable() {
    this.dauSach.changeStatus(1, this.enableBookCode).subscribe();
    this.formModalEnable.hide();
    window.location.reload();
  }

  changePage(event: any): void {
    this.pageCurrent = event;
    this.router.navigate(["/sys/list-categories", this.genre_id], {
      queryParams: { page: this.pageCurrent },
    });
  }
}
