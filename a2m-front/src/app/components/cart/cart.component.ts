import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription, forkJoin, map } from "rxjs";
import { User0101Service } from "src/app/_service/user/user0101.service";
import { CommonConstant } from "src/app/_constant/common.constants";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import Swal from "sweetalert2";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { FileService } from "src/app/_service/comm/file.service";
import { DauSach } from "src/app/_model/models/book.model";
import { User0201Service } from "src/app/_service/user/phieumuon/user0201.service";
import { User0102Service } from "src/app/_service/user/user0102.service";
import { DataResponse } from "src/app/_model/resp/data-response";

@Component({
  selector: "mg-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  // providers: [User0101Service],
  host: {
    class: "xyz", // Đặt tên class bạn muốn sử dụng
  },
  styles: [
    `
      .xyz {
        width: 100%;
      }
    `,
  ],
})
export class CartComponent implements OnInit, OnDestroy {
  selectAll: boolean = false;
  selectedBook: DauSach[] = [];
  bookInCart: DauSach[] = [];
  bookInCartActive: DauSach[] = [];
  // imgActive: any[] = [];
  bookInCartDisable: DauSach[] = [];
  subscriptions: Subscription[] = [];
  bookInCartActiveCopy: DauSach[];

  imageToShowActiveSrc: string[] = [];
  imageToShowDisableSrc: string[] = [];

  constructor(
    private authen: AuthenticationService,
    private user0101Service: User0101Service,
    private router: Router,
    private user0201Service: User0201Service,
    private user0202Service: User0202Service,
    private fileService: FileService,
    private user0102Service: User0102Service,
    private toast: ToastrService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    // this.bookInCartActiveCopy = [...this.bookInCartActive];
    // this.getListBookInCart()
    this.getBook();
    this.selectedBook = [];
  }

  getBook() {
    // this.subscriptions.push(
    //   this.user0101Service.getListBookInCart().subscribe(data => {
    //     // Xử lý dữ liệu
    //   })
    // )
    this.subscriptions.push(
      this.user0101Service.getBooks().subscribe((books) => {
        this.bookInCart = [];
        this.bookInCartActive = [];
        this.bookInCartDisable = [];
        this.bookInCart = books;
        for (let i = 0; i < this.bookInCart.length; i++) {
          this.bookInCart[i].imagesSrc = [];
          for (let j = 0; j < this.bookInCart[i]?.images.length; j++) {
            let imgSrc = this.fileService.getFile(
              this.bookInCart[i].images[j].path
            );
            this.bookInCart[i].imagesSrc?.push(imgSrc);
          }
        }

        for (let b of this.bookInCart) {
          b.checked = false;
          if (b.estimateTimeHave !== "Có sẵn") {
            this.bookInCartDisable.push(b);
            for (let j = 0; j < b?.images.length; j++) {
              if (b.images[j].about === 0) {
                this.imageToShowDisableSrc.push(b.imagesSrc[j]);
                break;
              }
            }
          } else {
            this.bookInCartActive.push(b);
            for (let j = 0; j < b?.images.length; j++) {
              if (b.images[j].about === 0) {
                this.imageToShowActiveSrc.push(b.imagesSrc[j]);
                break;
              }
            }
          }
        }
      })
    );
  }

  updateSelectedBook(book: DauSach) {
    if (book.checked) {
      this.selectedBook.push(book);
    } else {
      const index = this.selectedBook.indexOf(book);
      if (index > -1) {
        this.selectedBook.splice(index, 1);
      }
    }
    // this.bookInCartActive = [...this.bookInCartActiveCopy];
  }

  deleteFromCart(book: DauSach) {
    this.user0101Service.delete(book).subscribe((resp) => {
      if (resp.status == CommonConstant.RESULT_OK) {
        this.toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
        this.selectedBook = [];
      } else {
        this.toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại");
      }
    });
  }

  showBookDetail(book: DauSach) {
    this.router
      .navigate(["/home/book", book.bookCode])
      .then((navigationResult) => {
        if (navigationResult) {
        } else {
        }
      });
  }

  selectAllBook() {
    if (!this.selectAll) {
      this.selectedBook = [];
      this.selectedBook = this.bookInCartActive;
    }
    if (this.selectAll) {
      this.selectedBook = [];
    }
    this.selectAll = !this.selectAll;
    this.bookInCartActiveCopy.forEach(
      (item) => (item.checked = this.selectAll)
    );
    this.bookInCartActiveCopy = [...this.bookInCartActive];
  }

  borrow() {
    var exist = 0;
    this.user0202Service.getPhieuByStatus(0).subscribe((response) => {
      if (response.status == CommonConstant.RESULT_WN) {
        this.authen.logIn();
      }
    });
    this.user0201Service.checkPhieuMuonExists().subscribe((response) => {
      const phieumuonNumber = response.responseData;
      if (phieumuonNumber === 1) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          // text: 'Bạn còn phiếu mượn chưa trả! Vui lòng trả phiếu mượn trước khi mượn thêm sách',
          text: "Bạn còn phiếu mượn đang trong trạng thái chờ! Bạn chỉ có thể có tối đa 1 phiếu ở trạng thái chờ",
        });
      } else {
        var bookCodeList: String[] = [];
        for (let item of this.selectedBook) {
          let id: string = item.bookCode!;
          bookCodeList.push(id);
        }
        this.router.navigate(["/user/checkout"], {
          state: { data: bookCodeList },
        });
      }
    });
  }

  addBookToWaitList(book: DauSach) {
    this.user0102Service.insert(book).subscribe({
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
}
