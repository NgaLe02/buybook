import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DauSach } from "src/app/_model/models/book.model";
import { DataResponse } from "src/app/_model/resp/data-response";
import { FileService } from "src/app/_service/comm/file.service";
import { StatisticService } from "src/app/_service/sys/book/statisitc.service";

@Component({
  selector: "app-statistic-book-borrowed",
  templateUrl: "./statistic-book-borrowed.component.html",
  styleUrls: ["./statistic-book-borrowed.component.scss"],
})
export class StatisticBookBorrowedComponent implements OnInit {
  bookList: DauSach[] = [];
  imageToShowSrc: string[] = [];
  userUid: string = "";
  selectedValueToShow: number = 0;
  search: string = "";

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 10;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private statistic: StatisticService,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userUid = "" + this.activatedRoute.snapshot.paramMap.get("id");

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.selectedValueToShow = Number(param.get("type"));
      this.pageCurrent = Number(param.get("page"));
      this.search = param.get("search") ?? "";

      this.statistic
        .getBookBorrowedOfUserToStatistic(
          this.userUid,
          this.selectedValueToShow,
          this.search
        )
        .subscribe({
          next: (res: DataResponse) => {
            this.bookList = [];
            this.bookList = res.responseData as DauSach[];

            if (this.bookList) {
              for (let i = 0; i < this.bookList?.length; i++) {
                this.bookList[i].imagesSrc = [];
                for (let j = 0; j < this.bookList[i]?.images?.length; j++) {
                  let imgSrc = this.fileService.getFile(
                    this.bookList[i].images[j].path
                  );
                  this.bookList[i].imagesSrc?.push(imgSrc);
                }
              }

              this.imageToShowSrc = [];
              for (let i = 0; i < this.bookList.length; i++) {
                for (let j = 0; j < this.bookList[i]?.images.length; j++) {
                  if (this.bookList[i].images[j].about === 0) {
                    this.imageToShowSrc.push(this.bookList[i].imagesSrc[j]);
                    break;
                  }
                }
              }
            }
          },
        });
    });
  }

  changePage(event: any): void {
    this.pageCurrent = event;
    this.router.navigate(["/sys/statistic/user/borrowed"], {
      queryParams: { page: this.pageCurrent },
    });
  }
}
