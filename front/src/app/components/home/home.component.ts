import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { User0101Service } from "src/app/_service/user/user0101.service";
import { CommonConstant } from "src/app/_constant/common.constants";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { SearchService } from "src/app/_service/comm/common.service";
import { DataResponse } from "src/app/_model/resp/data-response";
import { Subscription } from "rxjs";
import { FileService } from "src/app/_service/comm/file.service";
import { DauSach } from "src/app/_model/models/book.model";

@Component({
  selector: "mg-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticate: boolean = false;
  subscriptions: Subscription[] = [];

  inputText: string = ""; //tìm kiếm theo tên sách hoặc tác giả
  selectSearch: number = 0; // 0: tìm kiếm the tên sách, 1: tìm kiếm theo tên tác giả
  searchCategory: number = 0; //tìm kiếm theo 1 thể loại bởi id
  searchCategoryByName: string = ""; //tìm kiếm theo 1 thể loại bởi tên
  searchAuthor: string = "";
  listSearchAuthor: string[] = [""]; // tìm kiếm theo 1 hoặc nhiều tác giả
  listSearchCategory: number[] = [1, 4]; // tìm kiếm theo 1 hoặc nhiều thể loại
  type: string[] = [];

  listBookTitle: DauSach[];
  groupBookTitle: DauSach[][] = [];
  listBookTitleSerach: DauSach[];
  listAuthorToFIlter: string[] = [];
  imageArray: string[] = [];
  imageGroup: string[][] = [];

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 3;
  // tableSizes: any = [3, 6, 9, 12]

  // listAuthorToFilter = this._formBuilder.group({});

  imageToShowSrc: string[] = [];

  constructor(
    private authen: AuthenticationService,
    private toast: ToastrService,
    private router: Router,
    private dauSach: DauSachService,
    private user0101Service: User0101Service,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private fileService: FileService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.type = [];
      this.listSearchAuthor = [];

      this.pageCurrent = Number(param.get("page"));
      this.inputText = param.get("search1") ?? "";
      this.searchCategory = Number(param.get("category"));
      this.searchCategoryByName = param.get("categoryByName") ?? "";

      const tmp = param.get("author");
      const authors = tmp?.split("%");
      if (authors) {
        authors.forEach((a) => {
          if (a.length > 0) this.listSearchAuthor.push(a);
        });
      }
      // this.searchAuthor =  ?? "";

      const encodedType = param.get("type");
      // const decodedType = decodeURIComponent(encodedType!);
      if (encodedType) {
        const values = encodedType!.split("%");
        if (values[0].length > 0) this.type.push(values[0]);
        if (values.length > 1 && values[1].length > 0)
          this.type.push(values[1]);
      }

      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }
      this.listBookTitle = [];
      this.groupBookTitle = [];
      this.dauSach
        .getBookTitle(
          this.pageCurrent,
          this.inputText.valueOf(),
          this.searchCategory,
          this.listSearchCategory,
          this.listSearchAuthor,
          this.searchCategoryByName,
          this.type
        )
        .subscribe((data) => {});

      this.dauSach
        .countTotalBookTitle(
          this.inputText,
          this.searchCategory,
          this.listSearchAuthor,
          this.searchCategoryByName
        )
        .subscribe((data) => {});
    });

    this.dauSach.getAuthorToFilter().subscribe({
      next: (resp: DataResponse) => {
        if (resp.status === CommonConstant.RESULT_OK) {
          let result = resp.responseData as string[];
          // result.forEach((author) => {
          //   this.listAuthorToFilter.addControl(author, this._formBuilder.control(false));
          // });
          this.listAuthorToFIlter = [];
          this.listAuthorToFIlter = result;
        }
      },
    });

    this.subscriptions.push(
      this.dauSach.getQuantityBooks().subscribe((quantity) => {
        if (quantity.valueOf() % 12 === 0) {
          this.maxPage = quantity.valueOf() / 12;
        } else {
          this.maxPage = Math.floor(quantity.valueOf() / 12) + 1;
        }
      })
    );

    this.subscriptions.push(
      this.dauSach.getBooks().subscribe((books) => {
        this.listBookTitle = [];
        this.groupBookTitle = [];
        books.filter((book) => book.status! === "1");
        this.listBookTitle = books;

        for (let i = 0; i < this.listBookTitle.length; i++) {
          this.listBookTitle[i].imagesSrc = [];
          for (let j = 0; j < this.listBookTitle[i]?.images.length; j++) {
            let imgSrc = this.fileService.getFile(
              this.listBookTitle[i].images[j].path
            );
            this.listBookTitle[i].imagesSrc?.push(imgSrc);
          }
        }

        this.imageToShowSrc = [];
        for (let i = 0; i < this.listBookTitle.length; i++) {
          for (let j = 0; j < this.listBookTitle[i]?.images.length; j++) {
            if (this.listBookTitle[i].images[j].about === 0) {
              this.imageToShowSrc.push(this.listBookTitle[i].imagesSrc[j]);
              break;
            }
          }
        }

        for (let i = 0; i < this.listBookTitle.length; i += 4) {
          const group = this.listBookTitle.slice(i, i + 4);
          this.groupBookTitle.push(group);
        }
      })
    );
    this.searchService.dataEmitter.subscribe((value) => {
      this.inputText = value;
    });
  }

  addBookToCart(book: DauSach) {
    if (book.status == "0") {
      this.toast.error("Sách đã ngừng cung cấp!");
    } else {
      this.user0101Service.insert(book).subscribe((resp) => {
        if (resp.status == CommonConstant.RESULT_WN) {
          this.authen.logIn();
        } else if (resp.status == CommonConstant.RESULT_OK) {
          this.toast.success(resp.message);
        } else if (resp.status == CommonConstant.RESULT_NG) {
          this.toast.error(resp.message);
        }
      });
    }
  }

  showBookDetail(book: DauSach) {
    this.router.navigate(["/home/book", book.bookCode]).then(() => {});
  }

  changePage(event: any): void {
    this.pageCurrent = event;
    this.router.navigate(["/home"], {
      queryParams: { search: this.inputText, page: this.pageCurrent },
    });
  }

  handleCheckboxChange(value: string) {
    if (this.listSearchAuthor.includes(value)) {
      // Giá trị đã được chọn, loại bỏ khỏi mảng
      this.listSearchAuthor = this.listSearchAuthor.filter(
        (val) => val !== value
      );
    } else {
      // Giá trị chưa được chọn, thêm vào mảng
      this.listSearchAuthor.push(value);
    }
    this.reloadCurrentRoute();
  }

  reloadCurrentRoute() {
    const url = this.router.url;
    const currentUrl = url.split("?")[0];
    this.router.navigate([currentUrl], {
      queryParams: {
        page: 1,
        search: this.inputText,
        category: this.searchCategory,
        categoryByName: this.searchCategoryByName,
        author: this.listSearchAuthor.join("%"),
        type: this.type.join("%"),
      },
    });
  }

  selectCatBookTitle(value: string) {
    // console.log("before", this.type);
    if (this.type.includes(value)) {
      // Giá trị đã được chọn, loại bỏ khỏi mảng
      this.type = this.type.filter((val) => val !== value);
    } else {
      // Giá trị chưa được chọn, thêm vào mảng
      this.type.push(value);
    }
    this.reloadCurrentRoute();
  }
}
