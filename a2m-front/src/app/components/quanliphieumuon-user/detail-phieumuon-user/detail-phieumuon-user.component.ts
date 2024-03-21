import { lastValueFrom } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { FileService } from "src/app/_service/comm/file.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PhieuDanhGiaComponent } from "../phieu-danh-gia/phieu-danh-gia.component";
import { SachMuon } from "src/app/_model/models/borrowBook.model";

@Component({
  selector: "app-detail-phieumuon-user",
  templateUrl: "./detail-phieumuon-user.component.html",
  styleUrls: ["./detail-phieumuon-user.component.css"],
})
export class DetailPhieumuonUserComponent implements OnInit {
  status: number = 2;
  idPhieuMuon: number = 0;
  listBook: SachMuon[];
  listImg: any[] = [];
  userInfo: UserInfo;
  fine: number = 0;
  phieumuonDto: phieumuonDto;

  imageToShowSrc: string[] = [];
  isDanhGia: boolean = true;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private user0202Service: User0202Service,
    private fileService: FileService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.idPhieuMuon = params["id"];
    });

    this.route.queryParams.subscribe((params) => {
      this.status = params["status"];
    });
    await this.getDetailData();
    if (this.phieumuonDto && this.phieumuonDto.returnUpdateReal) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      this.isDanhGia = sevenDaysAgo < this.phieumuonDto.returnUpdateReal;
    }
  }

  async getDetailData() {
    const resp = await lastValueFrom(
      this.user0202Service.getDetailPhieuMuon(this.idPhieuMuon)
    );

    if (resp.status == CommonConstant.RESULT_OK) {
      this.phieumuonDto = resp.responseData as phieumuonDto;
      this.listBook = this.phieumuonDto?.listBook ?? [];
      this.userInfo = this.phieumuonDto?.userInfo as UserInfo;
      this.fine = this.phieumuonDto.fine;

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
  }

  open(book: DauSach) {
    const modalRef = this.modalService.open(PhieuDanhGiaComponent);
    modalRef.componentInstance.book = book;
  }
}
