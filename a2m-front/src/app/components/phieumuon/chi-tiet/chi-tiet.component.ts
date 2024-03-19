import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { Sys0301Service } from "src/app/_service/sys/phieumuon/sys0301.service";
import { Sys0303Service } from "src/app/_service/sys/phieumuon/sys0303.service";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { User0104Service } from "src/app/_service/user/user0104.service";
import { ToastrService } from "ngx-toastr";
import { forkJoin, map } from "rxjs";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";

@Component({
  selector: "app-chi-tiet",
  templateUrl: "./chi-tiet.component.html",
  styleUrls: ["./chi-tiet.component.css"],
})
export class ChiTietComponent implements OnInit {
  idPhieuMuon: number = 0;
  status: number = 0;
  listBook: DauSach[];
  listImg: string[] = [];
  userInfo: UserInfo;
  phieumuonDto: phieumuonDto;
  modalUpdatePhieuCho: any;
  fine: number = 0;
  phieumuonCancel: phieumuonDto;

  imageToShowSrc: string[] = [];

  selectAllBook: boolean = true;
  listSelectedBook: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private sys0303Service: Sys0303Service,
    private sys0301service: Sys0301Service,
    private user0202Service: User0202Service,
    private user0104Service: User0104Service,
    private toastr: ToastrService,
    private dauSach: DauSachService,
    private fileService: FileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.status = params["status"];
    });
    this.route.params.subscribe((params) => {
      this.idPhieuMuon = params["id"];
    });
    this.getDetailData();
  }

  updatePhieuCho() {
    this.modalUpdatePhieuCho.show();
  }

  getDetailData() {
    this.sys0303Service.getDetailPhieuMuon(this.idPhieuMuon).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.phieumuonDto = resp.responseData as phieumuonDto;
          this.listBook = this.phieumuonDto?.listBook ?? [];

          this.userInfo = this.phieumuonDto?.userInfo as UserInfo;
          // console.log(this.phieumuonDto);
          // console.log("userInfo", this.userInfo);
          this.fine = this.phieumuonDto.fine;

          this.listSelectedBook = [];
          for (let i = 0; i < this.listBook.length; i++) {
            this.listSelectedBook.push(this.listBook[i].bookCode || "");
            this.listBook[i].imagesSrc = [];
            this.listBook[i].checked = true;
            for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
              let imgSrc = this.fileService.getImages(
                this.listBook[i].images[j].path
              );
              // console.log("imageSrc", imgSrc)
              this.listBook[i].imagesSrc?.push(imgSrc);
            }
            // console.log("listBookTitle", this.bookInCart[0].imagesSrc)
          }

          this.imageToShowSrc = [];
          console.log("listBook", this.listBook);
          for (let i = 0; i < this.listBook.length; i++) {
            for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
              if (this.listBook[i].images[j].about === 0) {
                this.imageToShowSrc.push(this.listBook[i].imagesSrc[j]);
                break;
              }
            }
          }

          // console.log("imageToShowSrc", this.imageToShowSrc)
          console.log("selectedBook", this.listSelectedBook);

          // forkJoin(subscribeList).pipe(
          //   map(() => {
          //   })
          // ).subscribe();
        }
      },
    });
  }

  updateSelectedBook(book: DauSach) {
    if (book.bookCode) {
      book.checked = !book.checked;
      // console.log("listBook", this.listBook)
      this.selectAllBook = this.listBook.every((b) => b.checked);
      // Lấy book.bookcode và cập nhật danh sách listSelectedBook
      this.listSelectedBook = this.listBook
        .filter((book) => book.checked === true) // Lọc các sách có checked = true
        .filter((book) => book.bookCode !== undefined) // Loại bỏ các bookcode undefined
        .map((book) => book.bookCode!); // Lấy bookcode từ các sách đã lọc
    }
    console.log("selectedBook", this.listSelectedBook);
  }

  xacNhanPhieuMuon(idPhieuMuon: number) {
    this.idPhieuMuon = idPhieuMuon;
    this.sys0301service
      .xacNhanPhieuMuon(idPhieuMuon, this.listSelectedBook)
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Xác nhận mượn thành công!",
            }).then(() => {
              window.history.back();
            });
          } else {
            // this.toastr.error(resp.message)
            Swal.fire({
              icon: "error",
              title: "Thất bại",
              text: resp.message,
            }).then(() => {
              this.router.navigate([
                "/sys/list-phieumuon/chi-tiet/" + resp.responseData,
              ]);
            });
          }
        },
      });
  }

  cancelPhieuMuon() {
    this.user0202Service
      .cancelPhieuDanhChoXacNhan(this.phieumuonCancel.idPhieuMuon + "")
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status === CommonConstant.RESULT_OK) {
            this.getDetailData();
            this.user0104Service.countTotalNotiUnread().subscribe((data) => {});
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Hủy phiếu mượn thành công!",
            }).then(() => {
              window.history.back();
            });
          }
        },
        error: (err: any) => {},
      });
  }

  phieuMuonSelected(item: phieumuonDto) {
    this.phieumuonCancel = item;
  }
}
