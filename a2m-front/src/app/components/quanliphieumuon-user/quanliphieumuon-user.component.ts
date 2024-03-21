import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/_service/comm/common.service';
import { User0202Service } from 'src/app/_service/user/phieumuon/user0202.service';
import Swal from 'sweetalert2';
declare var window: any;

@Component({
  selector: 'app-quanliphieumuon-user',
  templateUrl: './quanliphieumuon-user.component.html',
  styleUrls: ['./quanliphieumuon-user.component.css']
})
export class QuanliphieumuonUserComponent implements OnInit {
  status: number;
  constructor(private user0202Service: User0202Service,
    private searchService: SearchService) {
  }
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
}
