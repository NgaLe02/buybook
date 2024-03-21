import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserInfo } from "src/app/_model/auth/user-info";
import { SearchService } from "src/app/_service/comm/common.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./userlist.component.html",
  styleUrls: ["./userlist.component.css"],
})
export class UserListComponent implements OnInit {
  users: UserInfo[];
  usersActive: UserInfo[] = [];
  userDisable: UserInfo[] = [];
  userTemp: UserInfo[] = [];
  statusShow: String = "0";
  numbersArray: Number[] = [];
  pageCurrent: number = 1;
  file: File;
  totalPhieuMuon: any;
  username: string;

  status: string = "";

  constructor(private searchService: SearchService, private router: Router) {}
  ngOnInit(): void {}

  searchBookBackEnd() {
    const path = this.router.url;
    const currentUrl = path.split("?")[0];
    this.router.navigate([currentUrl], {
      queryParams: { page: 1, search: this.username },
    });
  }

  selectAcitve() {
    this.username = "";
    this.router.navigate(["/sys/user-list/status/02-03"], {
      queryParams: { page: 1 },
    });
  }

  selectDiActive() {
    this.username = "";
    this.router.navigate(["/sys/user-list/status/02-04"], {
      queryParams: { page: 1 },
    });
  }

  isActive(route: string): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes(route);
  }
}
