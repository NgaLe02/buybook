import { Component, OnInit } from '@angular/core';
import { AuthConstant } from 'src/app/_constant/auth.constant';
import { AuthenticationService } from 'src/app/_service/auth/authentication.service';
import { LoaderService } from 'src/app/_service/comm/loader.service';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sys0201',
  templateUrl: './sys0201.component.html',
  styleUrls: ['./sys0201.component.css']
})
export class Sys0201Component implements OnInit {
  bookCodeList: string[] = [];
  constructor(
    private authService: AuthenticationService,
    private loading: LoaderService,
    private toastr: ToastrService,
  ) {  }
    

  ngOnInit(): void {
    // this.bookCodeList[0] = "ATMD";
    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      this.loading.change(true)
        error: (err: any) => {
          this.loading.change(false)
        }
    }
  }
}