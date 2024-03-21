import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { Sys0301Service } from "src/app/_service/sys/phieumuon/sys0301.service";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { SearchService } from "src/app/_service/comm/common.service";
import { User0104Service } from "src/app/_service/user/user0104.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
declare var window: any;

@Component({
  selector: "app-list-cho",
  templateUrl: "./list-cho.component.html",
  styleUrls: ["./list-cho.component.css"],
})
export class ListChoComponent implements OnInit {
  list: phieumuonDto[];
  status: number = 0;
  reverse: boolean = false;
  selectedItem: any;
  formModalOk: any;
  ModalConfirmAll: any;
  idPhieuMuon: number = 0;
  numbersArray: Number[] = [];

  selectAllChecked = false;
  isAnyCheckboxChecked: boolean = false;
  username: string;
  phieuMuonToCancel: phieumuonDto;
  listChecked: any[] = [];
  totalPhieuMuon: any;
  selectedStatus: number = 0;
  statusOfPhieuMuon: number = 0;

  listSelectedBook: string[] = [];

  pageCurrent: number = 1;
  tableSize: number = 15;
  maxPage: number;

  constructor(
    private sys0301service: Sys0301Service,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private user0202Service: User0202Service,
    private user0104Service: User0104Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.searchService.raiseStatutEmitterEvent(0);

    this.formModalOk = new window.bootstrap.Modal(
      document.getElementById("itemModal")
    );

    this.ModalConfirmAll = new window.bootstrap.Modal(
      document.getElementById("modalConfirmAll")
    );

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
      this.username = param.get("search") ?? "";
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }
      this.totalPhieu();

      this.getData();
    });
  }

  toggleSelectAll(item: any) {
    this.selectedItem = item;
    this.selectAllChecked = this.selectAllChecked;
    // Đặt trạng thái của checkbox cho từng mục trong danh sách
    this.list.forEach((item) => (item.checked = this.selectAllChecked));
    this.isAnyCheckboxChecked = this.list.some((item) => item.checked);
    this.selectedItem = this.list.find((item) => item.checked);
  }

  chekcedItem(item: any) {
    this.selectedItem = item;
    this.selectedItem = this.list.find((item) => item.checked);
    if (this.selectedItem == undefined) {
      this.isAnyCheckboxChecked = !this.list.some((item) => item.checked);
    }
  }

  confirmAll() {
    const selectedItems = this.list.filter((item) => item.checked);
    if (selectedItems.length > 0) {
      // Thực hiện hàm updateStatus cho từng mục đã được chọn
      selectedItems.forEach((item) => {
        const id = item.idPhieuMuon ?? 0; // Sử dụng giá trị mặc định 0 nếu idPhieuMuon là undefined
        this.updateStatus(id);
      });
    } else {
      this.toastr.error("Vui lòng chọn ít nhất 1 phiếu!");
    }
  }
  openModal(item: any) {
    this.selectedItem = item;
    this.formModalOk.show();
  }

  openModalConfirmAll() {
    this.ModalConfirmAll.show();
  }

  sortByCreatedDate() {
    if (this.reverse) {
      this.list.sort((a, b) => {
        const dateA = a.borrowDate ? new Date(a.borrowDate) : null;
        const dateB = b.borrowDate ? new Date(b.borrowDate) : null;
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
    } else {
      this.list.sort((a, b) => {
        const dateA = a.borrowDate ? new Date(a.borrowDate) : null;
        const dateB = b.borrowDate ? new Date(b.borrowDate) : null;
        if (dateA && dateB) {
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      });
    }

    this.reverse = !this.reverse;
  }

  updateStatus(idPhieuMuon: number) {
    this.idPhieuMuon = idPhieuMuon;
    this.sys0301service
      .xacNhanPhieuMuon(idPhieuMuon, this.listSelectedBook)
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Xác nhận phiếu mượn thành công!",
            }).then(() => {
              this.router.navigate(["/sys/list-phieumuon/status/1"]);
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

  getData() {
    this.sys0301service
      .getListPhieuMuonLimit(
        this.status,
        this.pageCurrent,
        this.selectedStatus,
        this.username
      )
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            if (
              resp &&
              resp.listResponseData &&
              Array.isArray(resp.listResponseData)
            ) {
              this.list = [];
              this.list = resp.listResponseData.map((item: any) => {
                const phieumuonItem: phieumuonDto = {
                  idPhieuMuon: item.idPhieuMuon,
                  userUid: item.userUid,
                  createdDate: item.createdDate,
                  borrowDate: item.borrowDate,
                  returnDateEstimate: item.returnDateEstimate,
                  returnUpdateReal: item.returnUpdateReal,
                  status: item.status,
                  extended_times: item.extended_times,
                  countBook: item.countBook,
                  userInfo: item.userInfo as UserInfo,
                  fine: item.fine,
                  statusBorrowDate: item.statusBorrowDate,
                  listBook: item.listBook,
                };
                return phieumuonItem;
              });
            }
          }
        },
        error: (err: any) => {},
      });
  }

  totalPhieu() {
    this.sys0301service.getTotalPhieuByStatus(this.status).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.totalPhieuMuon = resp.responseData;
        }
      },
    });
  }

  cancelPhieuMuon() {
    this.user0202Service
      .cancelPhieuDanhChoXacNhan(this.phieuMuonToCancel.idPhieuMuon + "")
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status === CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Xác nhận phiếu mượn thành công!",
            }).then(() => {
              this.router.navigate(["/sys/list-phieumuon/status/0"], {
                queryParams: { page: 1, statusBorrowDate: this.selectedStatus },
              });
            });
            this.list = [];
            this.getData();
            this.user0104Service.countTotalNotiUnread().subscribe((data) => {});
          }
        },
        error: (err: any) => {},
      });
  }

  phieuMuonSelected(item: phieumuonDto) {
    this.phieuMuonToCancel = item;
  }

  onChangeSelectedStatus() {
    this.list = [];
    this.router.navigate(["/sys/list-phieumuon/status/0"], {
      queryParams: { page: 1, statusBorrowDate: this.selectedStatus },
    });
  }

  changePage(event: any): void {
    this.pageCurrent = event;
    this.router.navigate(["/sys/list-phieumuon/status/" + this.status], {
      queryParams: {
        page: this.pageCurrent,
      },
    });
  }
}
