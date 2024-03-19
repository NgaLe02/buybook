import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { Sys0303Service } from "src/app/_service/sys/phieumuon/sys0303.service";
import { forkJoin, map } from "rxjs";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.css"],
})
export class DetailComponent implements OnInit {
  idPhieuMuon: number = 0;
  phieumuonDto: phieumuonDto;
  listBook: DauSach[] = [];
  listImg: string[] = [];
  userInfo: UserInfo;
  selectedBookIds: string[] = [];
  remainingBookIds: string[] = [];

  imageToShowSrc: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private sys0303Service: Sys0303Service,
    private dauSach: DauSachService,
    private fileService: FileService,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idPhieuMuon = params.get("id");
      if (idPhieuMuon !== null) {
        this.idPhieuMuon = Number(idPhieuMuon);
      }
    });
    this.getDetailData();
  }

  getDetailData() {
    this.sys0303Service.getDetailPhieuMuon(this.idPhieuMuon).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.phieumuonDto = resp.responseData as phieumuonDto;
          this.listBook = this.phieumuonDto?.listBook ?? [];

          this.userInfo = this.phieumuonDto?.userInfo as UserInfo;
          console.log(this.userInfo);

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
          console.log("imageToShowSrc", this.imageToShowSrc);
        }
      },
    });
  }

  toggleBookSelection(bookId: string | undefined) {
    if (bookId !== undefined) {
      const index = this.selectedBookIds.indexOf(bookId);
      console.log(index);
      console.log(bookId);
      if (index > -1) {
        this.selectedBookIds.splice(index, 1); // Xóa ID sách nếu đã tồn tại trong mảng
      } else {
        this.selectedBookIds.push(bookId); // Thêm ID sách nếu chưa tồn tại trong mảng
      }
      this.remainingBookIds = (this.listBook ?? [])
        .filter((book) => book.bookCode !== undefined) // Loại bỏ các phần tử có giá trị undefined
        .map((book) => book.bookCode as string); // Ép kiểu id về string
      this.remainingBookIds = this.remainingBookIds.filter(
        (id) => !this.selectedBookIds.includes(id)
      ); // Lọc các phần tử chưa được chọn
      console.log(this.selectedBookIds);
    }
  }

  createaBill() {
    if (this.selectedBookIds.length == 0) {
      for (let c of this.listBook) {
        if (c.bookCode) {
          this.remainingBookIds.push(c.bookCode);
        }
      }
    }
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Tạo hóa đơn thành công!",
    }).then(() => {
      this.router.navigate(
        ["/sys/list-phieumuon/tra-sach/", this.idPhieuMuon],
        {
          queryParams: {
            selectedIds: this.selectedBookIds.join(","),
            remainingIds: this.remainingBookIds.join(","),
          },
        }
      );
    });
  }
}
