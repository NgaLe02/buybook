import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { DataService } from "src/app/_service/comm/data.service";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { Sys0301Service } from "src/app/_service/sys/phieumuon/sys0301.service";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { SearchService } from "src/app/_service/comm/common.service";
import { User0104Service } from "src/app/_service/user/user0104.service";
import { ToastrService } from "ngx-toastr";
import { forkJoin, map } from "rxjs";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";
declare var window: any;

@Component({
  selector: "app-dang-cho-xac-nhan",
  templateUrl: "./dang-cho-xac-nhan.component.html",
  styleUrls: ["../user-manage-phieu-muon.component.css"],
})
export class DangChoXacNhanComponent implements OnInit {
  id: number = 0;
  idPhieuMuon: number = 0;
  status: number = 0;
  listBook: DauSach[];
  phieumuonDto: phieumuonDto[];
  reverse: boolean = false;
  phieumuonCancel: phieumuonDto;
  numbersArray: Number[] = [];
  pageCurrent: Number = 1;
  listImg: string[] = [];

  listSelectedBook: string[] = [];
  imageToShowSrc: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private sys0301Service: Sys0301Service,
    private user0202Service: User0202Service,
    private toastr: ToastrService,
    private user0104Service: User0104Service,
    private searchService: SearchService,
    private router: Router,
    private dauSach: DauSachService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.searchService.raiseStatutEmitterEvent(0);
    this.id = this.dataService.getUserUid();
    for (let i = 1; i <= 5; i++) {
      this.numbersArray.push(i);
    }
    this.getData();
  }

  getData() {
    this.sys0301Service
      .getListPhieuMuonUserLimit(this.id, this.status, this.pageCurrent)
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            this.phieumuonDto = resp.listResponseData as phieumuonDto[];
            this.listBook = [];
            for (const item of this.phieumuonDto) {
              if (item.listBook) {
                this.listBook.push(...item.listBook);
              }
            }
            let subscribeList: any[] = [];
            for (let i = 0; i < this.listBook.length; i++) {
              this.listSelectedBook.push(this.listBook[i].bookCode || "");
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
          }
        },
        error: (err: any) => {},
      });
  }

  updateStatus() {
    this.sys0301Service
      .xacNhanPhieuMuon(
        Number(this.phieumuonCancel.idPhieuMuon),
        this.listSelectedBook
      )
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Xác nhận phiếu mượn thành công!",
            }).then(() => {
              this.router.navigate([
                "/sys/user-detail/" + this.id + "/phieu-muon/status/1",
              ]);
            });
          } else {
            this.toastr.error(resp.message);
            window.location.reload();
          }
        },
      });
  }

  getPhieuDangChoXacNhan(phieuMuon: phieumuonDto) {
    this.phieumuonCancel = phieuMuon;
  }

  cancelPhieuMuon() {
    this.user0202Service
      .cancelPhieuDanhChoXacNhan(this.phieumuonCancel.idPhieuMuon + "")
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status === CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Hủy phiếu mượn thành công!",
            }).then(() => {
              this.router.navigate([
                "/sys/user-detail/" + this.id + "/phieu-muon/status/3",
              ]);
            });
            this.phieumuonDto = [];
            this.getData();
            this.user0104Service.countTotalNotiUnread().subscribe((data) => {});
          }
        },
        error: (err: any) => {},
      });
  }
}
