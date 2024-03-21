import { Component, OnInit } from "@angular/core";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { DauSach, Sach } from "src/app/_model/models/book.model";
import { Subscription, map } from "rxjs";
import { FileService } from "src/app/_service/comm/file.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataResponse } from "src/app/_model/resp/data-response";

declare var window: any;

@Component({
  selector: "book-title",
  templateUrl: "./booktitle.component.html",
  styleUrls: ["./booktitle.component.css"],
})
export class BookTitleComponent implements OnInit {
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
    numberAccess: 0,
    author: "",
    createdYear: 0,
    category: 0,
    img: "",
    genres: [],
    images: [],
    imagesSrc: [],
  };
  quantity: 0;
  subscriptions: Subscription[] = [];

  status: string = "1";
  numbersArray: Number[] = [];

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 10;

  imageToShowSrc: string[] = [];

  nameSearch: string = "";

  selectedValueToAdd: string;
  selectedValueToShow: number = 0;

  sort: string = "00";
  //sortByDateAdd: 00: giảm dần, 01: tăng dần
  //sortByTitle: 10: từ A -> Z, 11: từ Z  -> A
  //sortByAuthor: 20: từ A -> Z, 21: từ Z -> A
  //sortByCountReadOnlinde: 30: giảm dần, 31: tăng dần
  //sortByNumberBook: giảm dần, 31: tăng dần

  showSelectSortTitle: boolean = false;
  showSelectSortAuthor: boolean = false;
  showSelectSortNumber: boolean = false;

  constructor(
    private fileService: FileService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dauSach: DauSachService
  ) {}

  userInfo = new UserInfo();

  setStatus(status: string) {
    this.status = status;
    this.pageCurrent = 1;
    this.nameSearch = "";
    this.router.navigate(["/sys/list-dausach/"], {
      queryParams: {
        page: this.pageCurrent,
        status: this.status,
        name: this.nameSearch,
        type: this.selectedValueToShow,
      },
    });
  }

  ngOnInit(): void {
    this.onRouter();

    this.formModalDisable = new window.bootstrap.Modal(
      document.getElementById("modal-disable-cat")
    );
  }

  search() {
    this.router.navigate(["/sys/list-dausach/"], {
      queryParams: {
        page: this.pageCurrent,
        status: this.status,
        name: this.nameSearch,
        type: this.selectedValueToShow,
      },
    });
  }

  onRouter() {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
      this.nameSearch = param.get("name") ?? "";
      this.status = param.get("status") ?? "1";
      this.selectedValueToShow = Number(param.get("type"));
      this.sort = param.get("sort") ?? "00";

      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }

      this.data = [];

      this.fetchData();
    });
  }

  fetchData() {
    this.dauSach
      .countGetData(
        this.pageCurrent,
        this.nameSearch,
        this.status,
        this.selectedValueToShow
      )
      .subscribe({
        next: (res: DataResponse) => {
          const quantity = res.responseData as number;
          this.maxPage = quantity;
        },
      });

    this.dauSach
      .getData(
        this.pageCurrent,
        this.nameSearch,
        this.status,
        this.selectedValueToShow,
        this.sort
      )
      .pipe(
        map((response) => {
          this.data = [];
          this.data = response.responseData;
          console.log(this.data);
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].imagesSrc = [];
            for (let j = 0; j < this.data[i]?.images?.length; j++) {
              let imgSrc = this.fileService.getFile(
                this.data[i].images[j].path
              );
              this.data[i].imagesSrc?.push(imgSrc);
            }
          }
          this.imageToShowSrc = [];
          for (let c of this.data) {
            for (let j = 0; j < c?.images.length; j++) {
              if (c.images[j].about === 0) {
                this.imageToShowSrc.push(c.imagesSrc[j]);
                break;
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
    this.router.navigate(["/sys/list-dausach"], {
      queryParams: {
        page: this.pageCurrent,
        status: this.status,
        name: this.nameSearch,
        type: this.selectedValueToShow,
      },
    });
  }
  onChangeBookToShow() {
    this.nameSearch = "";
    this.router.navigate(["/sys/list-dausach/"], {
      queryParams: {
        page: this.pageCurrent,
        status: this.status,
        name: this.nameSearch,
        type: this.selectedValueToShow,
      },
    });
  }

  changeSort(sort: string) {
    this.sort = sort;
    this.router.navigate(["/sys/list-dausach/"], {
      queryParams: {
        page: this.pageCurrent,
        status: this.status,
        name: this.nameSearch,
        type: this.selectedValueToShow,
        sort: this.sort,
      },
    });
  }

  toggleSelectSortTitle() {
    this.showSelectSortTitle = !this.showSelectSortTitle;
  }

  toggleSelectSortAuthor() {
    this.showSelectSortAuthor = !this.showSelectSortAuthor;
  }

  toggleSelectSortNumber() {
    this.showSelectSortNumber = !this.showSelectSortNumber;
  }
}
