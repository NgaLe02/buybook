import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthConstant } from "src/app/_constant/auth.constant";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { LoaderService } from "src/app/_service/comm/loader.service";
import { Sys0101Service } from "src/app/_service/sys/sys0101.service";
import { SearchService } from "src/app/_service/comm/common.service";
import { Cookie } from "ng2-cookies";

@Component({
  selector: "app-user-active",
  templateUrl: "./user-active.component.html",
  styleUrls: ["../userlist.component.css"],
})
export class UserActiveComponent implements OnInit {
  users: UserInfo[];
  listUsers: UserInfo[] = [];
  statusShow: String = "0";
  numbersArray: Number[] = [];
  previewImage: any;
  file: File;
  totalUsers: any;
  username: string;
  status: string = "02-03";

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 15;
  tableSizes: any = [5, 10, 15, 20];
  constructor(
    private sys0101Service: Sys0101Service,
    private loading: LoaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = "";

    this.onRouter();
  }

  getListUser() {
    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      this.sys0101Service
        .countListUser(this.status, this.pageCurrent, this.username)
        .subscribe({
          next: (res: DataResponse) => {
            const quantity = res.responseData as number;
            this.maxPage = quantity;
          },
        });
      this.sys0101Service
        .getListUser(this.status, this.pageCurrent, this.username)
        .subscribe({
          next: (resp: DataResponse) => {
            this.users = resp.listResponseData;
          },
          error: (err: any) => {
            this.loading.change(false);
          },
        });
    }
  }

  onRouter() {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.username = param.get("search") ?? "";
      this.pageCurrent = Number(param.get("page"));
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }
      this.users = [];
      this.getListUser();
    });
  }

  changePage(event: any): void {
    this.pageCurrent = event;
    this.router.navigate(["/sys/user-list/status/02-03"], {
      queryParams: {
        page: this.pageCurrent,
        search: this.username,
      },
    });
  }
}
