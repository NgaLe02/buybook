import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/_service/comm/common.service';
declare var window: any;

@Component({
  selector: 'app-phieumuon',
  templateUrl: './phieumuon.component.html',
  styleUrls: ['./phieumuon.component.css']
})
export class PhieumuonComponent implements  AfterViewInit ,OnInit {
  status: number;

  constructor(private searchService: SearchService,

  ) { }

  ngOnInit(): void {
    this.status = Number(localStorage.getItem('status')) || 0;
    this.searchService.statusOfPhieuMuonEmitter.subscribe((value) => {
      this.status = value;
    })

  }

  onChangeStatus(status: number): void {
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