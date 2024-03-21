import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthConstant } from "src/app/_constant/auth.constant";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DataService } from "src/app/_service/comm/data.service";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { Cookie } from "ng2-cookies";

@Component({
  selector: "app-dashboards",
  templateUrl: "./dashboards.component.html",
  styleUrls: ["./dashboards.component.css"],
})
export class DashboardsComponent implements OnInit {
  roleUser: any[];

  constructor() {}

  ngOnInit(): void {}
}
