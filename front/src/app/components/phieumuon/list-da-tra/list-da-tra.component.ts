import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { Sys0301Service } from "src/app/_service/sys/phieumuon/sys0301.service";
import { SearchService } from "src/app/_service/comm/common.service";

@Component({
  selector: "app-list-da-tra",
  templateUrl: "./list-da-tra.component.html",
  styleUrls: ["./list-da-tra.component.css"],
})
export class ListDaTraComponent implements OnInit {
  list: phieumuonDto[];
  status: number = 2;
  reverse: boolean = false;
  selectedItem: any;
  formModalOk: any;
  idPhieuMuon: number = 0;
  numbersArray: Number[] = [];

  pageCurrent: number = 1;
  tableSize: number = 15;
  maxPage: number;

  username: string; // tìm kieesm
  totalPhieuMuon: any;
  statusOfPhieuMuon: number = 0;

  constructor(
    private sys0301service: Sys0301Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.searchService.raiseStatutEmitterEvent(2);
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

  sortByBorrowDate() {
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

  sortByReturnUpdateReal() {
    if (this.reverse) {
      this.list.sort((a, b) => {
        const dateA = a.returnUpdateReal ? new Date(a.returnUpdateReal) : null;
        const dateB = b.returnUpdateReal ? new Date(b.returnUpdateReal) : null;
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
    } else {
      this.list.sort((a, b) => {
        const dateA = a.returnUpdateReal ? new Date(a.returnUpdateReal) : null;
        const dateB = b.returnUpdateReal ? new Date(b.returnUpdateReal) : null;
        if (dateA && dateB) {
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      });
    }

    this.reverse = !this.reverse;
  }

  getData() {
    this.list = [];
    this.sys0301service
      .getListPhieuMuonLimit(this.status, this.pageCurrent, 0, this.username)
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            if (
              resp &&
              resp.listResponseData &&
              Array.isArray(resp.listResponseData)
            ) {
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
                  borrowDateReal: item.borrowDateReal,
                };
                return phieumuonItem;
              });
            }
          }
        },
        error: (err: any) => {},
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

  totalPhieu() {
    this.sys0301service.getTotalPhieuByStatus(this.status).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.maxPage = resp.responseData as number;
        }
      },
    });
  }
}
