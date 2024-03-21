import { DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { DauSach } from "src/app/_model/models/book.model";
import { phieumuonDto } from "src/app/_model/models/phieumuonDto.model";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { Sys0303Service } from "src/app/_service/sys/phieumuon/sys0303.service";
import { ToastrService } from "ngx-toastr";
import { forkJoin, map } from "rxjs";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-trasach",
  templateUrl: "./trasach.component.html",
  styleUrls: ["./trasach.component.css"],
})
export class TrasachComponent implements OnInit {
  idPhieuMuon: number = 0;
  phieumuonDto: phieumuonDto;
  listBook: DauSach[];
  userInfo: UserInfo;
  total: number = 0;
  selectedIds: string[] = [];
  remainingIds: string[] = [];
  fine: number = 0;
  displayFine: number = this.fine;
  currentDate: string;
  // listImg: string[] = []

  imageToShowSrc: string[] = [];
  @ViewChild("exportComponent") exportComponent: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private sys0303Service: Sys0303Service,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private dauSach: DauSachService,
    private fileService: FileService
  ) {
    this.currentDate = this.datePipe.transform(
      new Date(),
      "dd/MM/yyyy"
    ) as string;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idPhieuMuon = params.get("id");
      if (idPhieuMuon !== null) {
        this.idPhieuMuon = Number(idPhieuMuon);
      }
    });
    this.getDetailData();
    this.route.queryParams.subscribe((params) => {
      this.selectedIds = params["selectedIds"]
        ? params["selectedIds"].split(",")
        : [];
      this.remainingIds = params["remainingIds"]
        ? params["remainingIds"].split(",")
        : [];
    });

    this.getFine();
  }

  getFine() {
    this.sys0303Service.getFine(this.idPhieuMuon, this.selectedIds).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.fine = Number(resp.responseData);
          this.displayFine = Number(resp.responseData);
        }
      },
    });
  }

  exportToPDF() {
    const doc = new jsPDF();
    const exportComponent = this.exportComponent.nativeElement;

    html2canvas(exportComponent).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imageData, "PNG", 0, 0, imgWidth, imgHeight);
      doc.save("exported.pdf");
    });
  }

  getDetailData() {
    this.sys0303Service.getDetailPhieuMuon(this.idPhieuMuon).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.phieumuonDto = resp.responseData as phieumuonDto;
          this.listBook = this.phieumuonDto?.listBook ?? [];
          this.userInfo = this.phieumuonDto?.userInfo as UserInfo;

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

  changeStatusToReturnBook() {
    this.sys0303Service
      .changeStatusToReturnBook(this.idPhieuMuon, this.remainingIds)
      .subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Xác nhận phiếu đã trả thành công!",
            }).then(() => {
              this.router.navigate(["/sys/list-phieumuon/status/2"]);
            });
          } else {
            this.toastr.error("Xác nhận phiếu đã trả thất bại!");
          }
        },
      });
  }
}
