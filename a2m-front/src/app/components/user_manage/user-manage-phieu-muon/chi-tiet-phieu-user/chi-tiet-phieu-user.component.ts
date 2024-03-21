import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { DataService } from "src/app/_service/comm/data.service";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { Sys0301Service } from "src/app/_service/sys/phieumuon/sys0301.service";
import { Sys0303Service } from "src/app/_service/sys/phieumuon/sys0303.service";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { forkJoin, map } from "rxjs";
import { FileService } from "src/app/_service/comm/file.service";

@Component({
  selector: "app-chi-tiet-phieu-user",
  templateUrl: "./chi-tiet-phieu-user.component.html",
  styleUrls: ["../user-manage-phieu-muon.component.css"],
})
export class ChiTietPhieuUserComponent implements OnInit {
  status: number = 2;
  idPhieuMuon: number = 0;
  listBook: DauSach[];
  userInfo: UserInfo;
  userUid: number = 0;
  phieumuonDto: phieumuonDto;
  listImg: string[] = [];

  imageToShowSrc: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private sys0303Service: Sys0303Service,
    private dauSach: DauSachService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idPhieuMuon = params["id"];
    });

    this.route.queryParams.subscribe((params) => {
      this.status = params["status"];
    });
    this.getDetailData();
  }

  getDetailData() {
    this.sys0303Service.getDetailPhieuMuon(this.idPhieuMuon).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.phieumuonDto = resp.responseData as phieumuonDto;
          this.listBook = this.phieumuonDto?.listBook ?? [];
          let subscribeList: any[] = [];
          for (let i = 0; i < this.listBook.length; i++) {
            this.listBook[i].imagesSrc = [];
            for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
              let imgSrc = this.fileService.getFile(
                this.listBook[i].images[j].path
              );
              this.listBook[i].imagesSrc?.push(imgSrc);
            }
          }
          this.imageToShowSrc = [];
          for (let i = 0; i < this.listBook.length; i++) {
            for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
              if (this.listBook[i].images[j].about === 0) {
                this.imageToShowSrc.push(this.listBook[i].imagesSrc[j]);
                break;
              }
            }
          }
        }
      },
    });
  }
}
