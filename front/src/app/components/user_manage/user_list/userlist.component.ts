import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserInfo } from 'src/app/_model/auth/user-info';
import { SearchService } from 'src/app/_service/comm/common.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserListComponent implements AfterViewInit, OnInit {

  users: UserInfo[];
  usersActive: UserInfo[] = [];
  userDisable: UserInfo[] = [];
  userTemp: UserInfo[] = []
  statusShow: String = '0'
  numbersArray: Number[] = [];
  pageCurrent: number = 1;
  file: File;
  totalPhieuMuon: any;
  username: string;

  status: string = ''

  constructor(
    private searchService: SearchService,
  ) {
  }
  ngOnInit(): void {
    this.status = String(localStorage.getItem('status')) || '';
    this.searchService.statusUserListEmittter.subscribe((value) => {
      this.status = value;
    })
  }

  onChangeStatus(status: string): void {
    this.status = status;
    localStorage.setItem('status', String(status));
  }

   // dùng để fix error: ERROR Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError:
  //  Expression has changed after it was checked. Previous value for 'checked': 'false'.
  //   Current value: 'true'. Find more at https://angular.io/errors/NG0100
  ngAfterViewInit() {
    setTimeout(() => {
      this.onChangeStatus(this.status);
    }, 0);
   }
 
}
