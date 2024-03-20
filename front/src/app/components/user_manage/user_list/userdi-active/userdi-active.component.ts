import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthConstant } from 'src/app/_constant/auth.constant';
import { CommonConstant } from 'src/app/_constant/common.constants';
import { UserInfo } from 'src/app/_model/auth/user-info';
import { DataResponse } from 'src/app/_model/resp/data-response';
import { AuthenticationService } from 'src/app/_service/auth/authentication.service';
import { LoaderService } from 'src/app/_service/comm/loader.service';
import { Sys0101Service } from 'src/app/_service/sys/sys0101.service';
import { SearchService } from 'src/app/_service/comm/common.service';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'app-userdi-active',
  templateUrl: './userdi-active.component.html',
  styleUrls: ['../userlist.component.css']
})
export class UserdiActiveComponent implements OnInit {
  users: UserInfo[];
  listUsers: UserInfo[] = [];
  statusShow: String = '0'
  numbersArray: Number[] = [];
  pageCurrent: number = 1;
  previewImage: any;
  file: File;
  totalPhieuMuon: any;
  username: string;
  status: string = '02-04'


  constructor(
    private authService: AuthenticationService,
    private sys0101Service: Sys0101Service,
    private loading: LoaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searching: SearchService
  ) { }

  ngOnInit(): void {
    this.searching.raiseStatusUserListEmiiterEvent('02-04')
    this.totalUser()
    this.pagination()

  }

  getListUser() {
    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      this.loading.change(true)
      this.sys0101Service.getListUser(this.status, this.pageCurrent).subscribe(
        {
          next: (resp: DataResponse) => {
            this.users = resp.listResponseData;
          },
          error: (err: any) => {
            this.loading.change(false)
          }
        }
      )
    }
  }

  getDataByUsername() {
    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      this.loading.change(true)
      this.sys0101Service.getListUserByUserid(this.username).subscribe(
        {
          next: (resp: DataResponse) => {
            this.users = resp.listResponseData;

          },
          error: (err: any) => {
            this.loading.change(false)
          }
        }
      )
    }
  }

  appendQueryParam(page: number) {
    let nextPage = this.pageCurrent + page;
    if (nextPage > 0) {
      this.router.navigate(['/sys/user-list'], { queryParams: { page: nextPage } })
    }
    console.log(nextPage);
  }

  currentPage(page: number) {
    if (page != 0) {
      this.router.navigate(['/sys/user-list'], { queryParams: { page: page } })
    }
  }

  pagination() {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"))
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1
      }
      this.users = [];
      this.getListUser();
    })
  }

  totalUser() {
    this.authService.getCountUser(this.status).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.totalPhieuMuon = resp.responseData;
          this.generateNumbersArray();
        }
      }
    })
  }
  
  generateNumbersArray() {
    const totalPages = Math.ceil(this.totalPhieuMuon / 5);
    this.numbersArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

}