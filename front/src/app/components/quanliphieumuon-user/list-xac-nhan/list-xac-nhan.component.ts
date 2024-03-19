import { Component, OnInit } from '@angular/core';
import { CommonConstant } from 'src/app/_constant/common.constants';
import { DataResponse } from 'src/app/_model/resp/data-response';
import { DauSach } from 'src/app/_model/models/book.model';
import { phieumuonDto } from 'src/app/_model/models/phieumuonDto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { User0104Service } from 'src/app/_service/user/user0104.service';
import { DauSachService } from 'src/app/_service/services/dausach.service';
import { SearchService } from 'src/app/_service/comm/common.service';
import Swal from 'sweetalert2'
import { forkJoin, map } from 'rxjs';
import { User0202Service } from 'src/app/_service/user/phieumuon/user0202.service';
import { FileService } from 'src/app/_service/comm/file.service';

@Component({
  selector: 'app-list-xac-nhan',
  templateUrl: './list-xac-nhan.component.html',
  styleUrls: ['./list-xac-nhan.component.css']
})
export class ListXacNhanComponent implements OnInit {
  status: number = 0;
  listBook: DauSach[];
  phieumuonDto: phieumuonDto[];
  reverse: boolean = false;
  listImg: string[] = [];
  phieumuonCancel: phieumuonDto;
  numbersArray: Number[] = [];
  pageCurrent: Number = 1;
  // genresList: any[] = [];
  imageToShowSrc: string[] = []


  constructor(private user0202Service: User0202Service,
    private user0104Service: User0104Service,
    private searchService: SearchService,
    private router: Router,
    private fileService: FileService,

  ) { }

  ngOnInit(): void {
    this.searchService.raiseStatutEmitterEvent(0);
    this.getData()
  }

  getData() {
    this.user0202Service.getPhieuByStatus(0).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.phieumuonDto = resp.listResponseData as phieumuonDto[];
          this.listBook = [];
          for (const item of this.phieumuonDto) {
            if (item.listBook) {
              this.listBook.push(...item.listBook);
            }
          }
          
          console.log("listxacnhan", this.listBook)
          for (let i = 0; i < this.listBook.length; i++) {
            this.listBook[i].imagesSrc = []
            for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
              let imgSrc = this.fileService.getImages(this.listBook[i].images[j].path);
              // console.log("imageSrc", imgSrc)
              this.listBook[i].imagesSrc?.push(imgSrc)
            }
            // console.log("listBookTitle", this.bookInCart[0].imagesSrc)
          }
  
          this.imageToShowSrc = []
          console.log("listBook", this.listBook)
          for (let i = 0; i < this.listBook.length; i++) {
            for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
              if(this.listBook[i].images[j].about ===  0){
                this.imageToShowSrc.push(this.listBook[i].imagesSrc[j])
              }
            }
          }
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getPhieuDangChoXacNhan(phieuMuon: phieumuonDto) {
    this.phieumuonCancel = phieuMuon;
  }

  cancelPhieuMuon() {
    this.user0202Service.cancelPhieuDanhChoXacNhan(this.phieumuonCancel.idPhieuMuon + '').subscribe({
      next: (resp: DataResponse) => {
        if (resp.status === CommonConstant.RESULT_OK) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Hủy phiếu mượn thành công!',
          }).then(
            () => {
              this.router.navigate(['/user/phieumuon/status/3']);
            });
          this.phieumuonDto = []
          this.getData()
          this.user0104Service.countTotalNotiUnread().subscribe(data => {
          })
        }
      },
      error: (err: any) => {
      }
    })
  }
}
