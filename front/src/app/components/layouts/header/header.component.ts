import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "src/app/_service/comm/loader.service";
import { AuthConstant } from "src/app/_constant/auth.constant";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { User0101Service } from "src/app/_service/user/user0101.service";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { User0102Service } from "src/app/_service/user/user0102.service";
import { SearchService } from "src/app/_service/comm/common.service";
import { User0104Service } from "src/app/_service/user/user0104.service";
import { DataService } from "src/app/_service/comm/data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SseService } from "src/app/_service/comm/sse.service";
import { User0103Service } from "src/app/_service/user/user0103.service";
import { Role } from "src/app/_model/auth/role";
import { lastValueFrom } from "rxjs";
import { Cookie } from "ng2-cookies";
import { GenreBook } from "src/app/_model/models/genreBook.model";
// import { Observable } from 'rxjs';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  // cartData: CartModelServer;
  cartTotal: number;
  waitListTotal: number;
  notificationTotal: number;
  isAuthenticate: boolean = false;

  notification: any;
  listGenre: GenreBook[] = [];
  roleUser: Role[];

  isUserMenuVisible: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,

    public user0101Service: User0101Service,
    private authService: AuthenticationService,
    private user0102Service: User0102Service,
    private user0104Service: User0104Service,
    private searchService: SearchService,
    private dataService: DataService,
    private router: Router,
    private sse: SseService,
    private toast: ToastrService
  ) {}

  async ngOnInit() {
    this.cartTotal = 0;
    this.waitListTotal = 0;
    this.notificationTotal = 0;

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.enteredText = "";

      this.enteredText = param.get("search1") ?? "";
    });

    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      // (async () => {
      await this.getUserInfo();
      // })()
    }

    if (this.isAuthenticate) {
      this.user0101Service.getListBookInCart().subscribe((data) => {});
      this.user0101Service.getBooks().subscribe((books) => {
        this.cartTotal = books.length;
      });

      this.user0102Service.getListBookInWaitList().subscribe((data) => {});
      this.user0102Service.getBooks().subscribe((books) => {
        this.waitListTotal = books.length;
      });

      this.user0104Service.countTotalNotiUnread().subscribe((data) => {});

      this.user0104Service.getUnreadQuantityNotis().subscribe((quantiy) => {
        this.notificationTotal = quantiy.valueOf();
      });
    }
  }

  async getUserInfo(): Promise<void> {
    const resp = await lastValueFrom(this.authService.getUserInfo());
    if (resp.status == CommonConstant.RESULT_OK) {
      let userInfo: UserInfo = resp.responseData;
      this.roleUser = userInfo.roles ?? [];
      this.sse.connect(userInfo?.userUid);
      this.isAuthenticate = true;
    }
  }

  login() {
    this.authService.logIn();
  }

  logout() {
    this.dataService.setSelectedRole(false);
    this.authService.logOut();
  }

  signup() {
    this.authService.singup();
  }

  enteredText: string = "";
  selectSearch: number = 0; //chọn tìm kiếm theo tên sách theo tên tác giả

  onSearchTextChanged() {
    this.searchService.raiseDataEmitterEvent(this.enteredText);
    // this.searchService.raiseSelectSearchevent(this.selectSearch)
  }

  searchBookBackEnd() {
    if (this.selectSearch == 0) {
      this.router.navigate(["/home"], {
        queryParams: { search1: this.enteredText, page: 1 },
      });
    } else if (this.selectSearch == 1) {
      this.router.navigate(["/home"], {
        queryParams: { author: this.enteredText, page: 1 },
      });
    } else if (this.selectSearch == 2) {
      this.router.navigate(["/home"], {
        queryParams: { categoryByName: this.enteredText, page: 1 },
      });
    }
  }

  showToast() {
    this.toast.info(this.notification);
    setTimeout(() => {
      this.toast.clear();
    }, 30000);
  }

  search(genre: GenreBook) {
    this.router.navigate(["/home"], {
      queryParams: {
        search1: this.enteredText,
        category: genre.genre_id,
        page: 1,
      },
    });
  }

  toggleUserMenu() {
    this.isUserMenuVisible = !this.isUserMenuVisible;
  }
}
