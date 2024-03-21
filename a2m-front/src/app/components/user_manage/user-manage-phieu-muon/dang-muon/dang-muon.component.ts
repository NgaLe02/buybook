import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { DataService } from "src/app/_service/comm/data.service";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { Sys0301Service } from "src/app/_service/sys/phieumuon/sys0301.service";
import { SearchService } from "src/app/_service/comm/common.service";
import { ToastrService } from "ngx-toastr";
import { forkJoin, map } from "rxjs";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";

@Component({
  selector: "app-dang-muon",
  templateUrl: "./dang-muon.component.html",
  styleUrls: ["../user-manage-phieu-muon.component.css"],
})
export class DangMuonComponent implements OnInit {
  status: number = 1;
  phieumuonDto: phieumuonDto;
  listBook: DauSach[];
  selectedBookIds: string[] = [];
  remainingBookIds: string[] = [];
  userUid: number = 0;
  checkEmpty: boolean = false;
  listImg: string[] = [];

  imageToShowSrc: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private sys0301Service: Sys0301Service,
    private toastr: ToastrService,
    private searchService: SearchService,
    private dataService: DataService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.searchService.raiseStatutEmitterEvent(1);
    this.userUid = this.dataService.getUserUid();
    this.getDetailData();
    this.checkEmpty;
  }

  displayToastr() {
    this.toastr.success("Tạo hóa đơn thành công!");
  }

  getDetailData() {
    this.sys0301Service
      .getDetailPhieuMuonUser(this.userUid, this.status)
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            this.phieumuonDto = resp.responseData as phieumuonDto;
            this.listBook = this.phieumuonDto?.listBook ?? [];

            for (let i = 0; i < this.listBook.length; i++) {
              this.listBook[i].imagesSrc = [];
              for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
                let imgSrc = this.fileService.getFile(
                  this.listBook[i].images[j].path
                );
                this.listBook[i].imagesSrc?.push(imgSrc);
              }
            }

            this.imageToShowSrc = [];
            for (let i = 0; i < this.listBook.length; i++) {
              for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
                if (this.listBook[i].images[j].about === 0) {
                  this.imageToShowSrc.push(this.listBook[i].imagesSrc[j]);
                  break;
                }
              }
            }

            this.checkEmpty = true;
          }

          if (resp.status == CommonConstant.RESULT_NG) {
            this.checkEmpty = false;
          }
        },
      });
  }

  toggleBookSelection(bookId: string | undefined) {
    if (bookId !== undefined) {
      const index = this.selectedBookIds.indexOf(bookId);
      if (index > -1) {
        this.selectedBookIds.splice(index, 1); // Xóa ID sách nếu đã tồn tại trong mảng
      } else {
        this.selectedBookIds.push(bookId); // Thêm ID sách nếu chưa tồn tại trong mảng
      }
      this.remainingBookIds = (this.listBook ?? [])
        .filter((book) => book.bookCode !== undefined) // Loại bỏ các phần tử có giá trị undefined
        .map((book) => book.bookCode as string); // Ép kiểu id về string
      this.remainingBookIds = this.remainingBookIds.filter(
        (id) => !this.selectedBookIds.includes(id)
      ); // Lọc các phần tử chưa được chọn
    }
  }

  createaBill() {
    if (this.selectedBookIds.length == 0) {
      for (let c of this.listBook) {
        if (c.bookCode) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Tạo hóa đơn thành công!",
          });
          this.remainingBookIds.push(c.bookCode);
        }
      }
    }
  }
}
