import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { SearchService } from "src/app/_service/comm/common.service";

@Component({
  selector: "app-list-da-tra",
  templateUrl: "./list-da-tra.component.html",
  styleUrls: ["../quanliphieumuon-user.component.css"],
})
export class ListDaTraComponent implements OnInit {
  reverse: boolean = false;
  status: number = 2;
  listBook: DauSach[];
  list: phieumuonDto[];
  numbersArray: Number[] = [];
  pageCurrent: number = 1;
  idPhieuMuon: number = 0;
  totalPhieuMuon: any;

  constructor(
    private user0202Service: User0202Service,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.raiseStatutEmitterEvent(2);
    this.totalPhieu();
    this.getData();
    this.pagination();
  }

  getData() {
    this.user0202Service.getListPhieuMuonLimit(2, this.pageCurrent).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.list = resp.listResponseData as phieumuonDto[];
          this.listBook = [];
          for (const item of this.list) {
            if (item.listBook) {
              this.listBook.push(...item.listBook);
            }
          }
        }
      },
      error: (err: any) => {},
    });
  }

  sortByCreatedDate() {
    if (this.reverse) {
      this.list.sort((a, b) => {
        const dateA = a.createdDate ? new Date(a.createdDate) : null;
        const dateB = b.createdDate ? new Date(b.createdDate) : null;
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
    } else {
      this.list.sort((a, b) => {
        const dateA = a.createdDate ? new Date(a.createdDate) : null;
        const dateB = b.createdDate ? new Date(b.createdDate) : null;
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

  appendQueryParam(page: number) {
    let nextPage = this.pageCurrent + page;
    if (nextPage > 0) {
      this.router.navigate(["/user/phieumuon/status/" + this.status], {
        queryParams: { page: nextPage },
      });
    }
  }

  currentPage(page: number) {
    if (page != 0) {
      this.router.navigate(["/user/phieumuon/status/" + this.status], {
        queryParams: { page: page },
      });
    }
  }

  pagination() {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }
      this.list = [];
      this.getData();
    });
  }

  totalPhieu() {
    this.user0202Service
      .getCountPhieuByUserUidAndStatus(this.status)
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            this.totalPhieuMuon = resp.responseData;
            this.generateNumbersArray();
          }
        },
      });
  }
  generateNumbersArray() {
    const totalPages = Math.ceil(this.totalPhieuMuon / 5);
    this.numbersArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
