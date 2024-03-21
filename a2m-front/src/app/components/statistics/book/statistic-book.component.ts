import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DauSach } from "src/app/_model/models/book.model";
import { DataResponse } from "src/app/_model/resp/data-response";
import { SearchService } from "src/app/_service/comm/common.service";
import { FileService } from "src/app/_service/comm/file.service";
import { StatisticService } from "src/app/_service/sys/book/statisitc.service";

@Component({
  selector: "app-statistic-book",
  templateUrl: "./statistic-book.component.html",
  styleUrls: ["./statistic-book.component.scss"],
})
export class StatisticBookComponent implements OnInit {
  bookList: DauSach[] = [];
  imageToShowSrc: string[] = [];

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 10;
  tableSizes: any = [5, 10, 15, 20];

  search: string = "";
  selectedValueToShow: number = 0;

  constructor(
    private statistic: StatisticService,
    private fileService: FileService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
      this.selectedValueToShow = Number(param.get("type"));
      this.search = param.get("search") ?? "";
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }
      this.getData();
    });
  }

  getData() {
    this.statistic
      .countBooksToStatistic(
        this.search,
        this.pageCurrent,
        this.selectedValueToShow
      )
      .subscribe({
        next: (res: DataResponse) => {
          const quantity = res.responseData as number;
          this.maxPage = quantity;
        },
      });

    this.statistic
      .getBooksToStatistic(
        this.search,
        this.pageCurrent,
        this.selectedValueToShow
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
        },
      });
  }

  changePage(event: any): void {
    this.pageCurrent = event;
    this.router.navigate(["/sys/statistic/book"], {
      queryParams: { page: this.pageCurrent },
    });
  }
}
