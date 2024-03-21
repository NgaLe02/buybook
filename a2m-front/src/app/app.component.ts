import { Component, OnInit } from "@angular/core";
import { User0104Service } from "./_service/user/user0104.service";
import { SseService } from "./_service/comm/sse.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies";
import { AuthConstant } from "./_constant/auth.constant";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "AtwoM-Library";
  notification: any;

  constructor() {
    // public toast: ToastrService, // private sse: SseService, // private user0104Service: User0104Service,
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const _token = params.get("access_token");
    // debugger;
    if (_token) {
      Cookie.set(
        AuthConstant.ACCESS_TOKEN_KEY,
        _token,
        AuthConstant.TOKEN_EXPIRE,
        "/"
      );
    }
  }

  ngOnInit(): void {}
}
