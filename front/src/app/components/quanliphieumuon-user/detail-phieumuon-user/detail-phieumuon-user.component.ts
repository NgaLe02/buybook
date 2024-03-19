import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { User0202Service } from "src/app/_service/user/phieumuon/user0202.service";
import { FileService } from "src/app/_service/comm/file.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PhieuDanhGiaComponent } from "../phieu-danh-gia/phieu-danh-gia.component";

@Component({
  selector: "app-detail-phieumuon-user",
  templateUrl: "./detail-phieumuon-user.component.html",
  styleUrls: ["./detail-phieumuon-user.component.css"],
})
export class DetailPhieumuonUserComponent implements OnInit {
  status: number = 2;
  idPhieuMuon: number = 0;
  listBook: DauSach[];
  listImg: any[] = [];
  userInfo: UserInfo;
  fine: number = 0;
  phieumuonDto: phieumuonDto;

  imageToShowSrc: string[] = [];

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private user0202Service: User0202Service,
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
    this.user0202Service.getDetailPhieuMuon(this.idPhieuMuon).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.phieumuonDto = resp.responseData as phieumuonDto;
          this.listBook = this.phieumuonDto?.listBook ?? [];

          this.userInfo = this.phieumuonDto?.userInfo as UserInfo;
          console.log(this.phieumuonDto);
          console.log(this.userInfo);
          this.fine = this.phieumuonDto.fine;

          for (let i = 0; i < this.listBook.length; i++) {
            this.listBook[i].imagesSrc = [];
            for (let j = 0; j < this.listBook[i]?.images?.length; j++) {
              let imgSrc = this.fileService.getImages(
                this.listBook[i].images[j].path
              );
              // console.log("imageSrc", imgSrc)
              this.listBook[i].imagesSrc?.push(imgSrc);
            }
            // console.log("listBookTitle", this.bookInCart[0].imagesSrc)
          }

          this.imageToShowSrc = [];
          console.log("listBook", this.listBook);
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

  open(book: DauSach) {
    const modalRef = this.modalService.open(PhieuDanhGiaComponent);
    modalRef.componentInstance.book = book;
  }
}
