import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription, forkJoin, map } from "rxjs";
import { style } from "@angular/animations";
import { User0101Service } from "src/app/_service/user/user0101.service";
import { CommonConstant } from "src/app/_constant/common.constants";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { User0102Service } from "src/app/_service/user/user0102.service";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { DauSachService } from "src/app/_service/services/dausach.service";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";
import { DauSach } from "src/app/_model/models/book.model";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { User0201Service } from "src/app/_service/user/phieumuon/user0201.service";

@Component({
  selector: "mg-waitlist",
  templateUrl: "./waitlist.component.html",
  styleUrls: ["./waitlist.component.scss"],
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
export class WaitListComponent implements OnInit, OnDestroy {
  //   cartData: CartModelServer;
  selectAll: boolean = false;
  waitListTotal: number;
  selectedBook: DauSach[] = [];
  bookInWaitList: DauSach[] = [];
  bookInWaitListActive: DauSach[] = [];
  bookInWaitListDisable: DauSach[] = [];
  subscriptions: Subscription[] = [];

  imageToShowActiveSrc: string[] = [];
  imageToShowDisableSrc: string[] = [];

  constructor(
    private user0102Service: User0102Service,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dauSach: DauSachService,
    private authen: AuthenticationService,
    private toast: ToastrService,
    private user0202Service: User0202Service,
    private user0101Service: User0101Service,
    private user0201Service: User0201Service,
    private fileService: FileService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit() {
    this.getbook();
    this.selectedBook = [];
  }

  getbook() {
    this.subscriptions.push(
      this.user0102Service.getBooks().subscribe((books) => {
        this.bookInWaitList = [];
        this.bookInWaitListActive = [];
        this.bookInWaitListDisable = [];
        this.bookInWaitList = books;

        for (let i = 0; i < this.bookInWaitList.length; i++) {
          this.bookInWaitList[i].imagesSrc = [];
          for (let j = 0; j < this.bookInWaitList[i]?.images?.length; j++) {
            let imgSrc = this.fileService.getFile(
              this.bookInWaitList[i].images[j].path
            );
            this.bookInWaitList[i].imagesSrc?.push(imgSrc);
          }
        }

        for (let b of this.bookInWaitList) {
          if (b.quantity == 0) {
            this.bookInWaitListDisable.push(b);
            for (let j = 0; j < b?.images.length; j++) {
              if (b.images[j].about === 0) {
                this.imageToShowDisableSrc.push(b.imagesSrc[j]);
                break;
              }
            }
          } else {
            this.bookInWaitListActive.push(b);
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
  }

  deleteFromWaitList(book: DauSach) {
    this.user0102Service.delete(book).subscribe((resp) => {
      if (resp.status == CommonConstant.RESULT_OK) {
        this.toast.success(resp.message);
      } else {
        this.toast.error(resp.message);
      }
    });
  }

  borrowMany() {
    var exist = 0;
    this.user0202Service.getPhieuByStatus(0).subscribe((response) => {
      if (response.status == CommonConstant.RESULT_WN) {
        this.authen.logIn();
      }
    });
    this.user0201Service.checkPhieuMuonExists().subscribe((response) => {
      const phieumuonNumber = response.responseData;
      if (phieumuonNumber !== 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Bạn còn phiếu mượn chưa trả! Vui lòng trả phiếu mượn trước khi mượn thêm sách",
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
  addBookToCart(bookTitle: DauSach) {
    this.user0101Service.insert(bookTitle).subscribe((resp) => {
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
