import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DauSach } from "src/app/_model/models/book.model";
import { DataResponse } from "src/app/_model/resp/data-response";
import { FileService } from "src/app/_service/comm/file.service";
import { StatisticService } from "src/app/_service/sys/book/statisitcBook.service";

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
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private statistic: StatisticService,
    private fileService: FileService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
    });

    this.statistic.getBooksToStatistic().subscribe({
      next: (res: DataResponse) => {
        this.bookList = [];
        this.bookList = res.responseData as DauSach[];
        // console.log(this.bookList)

        for (let i = 0; i < this.bookList.length; i++) {
          this.bookList[i].imagesSrc = [];
          for (let j = 0; j < this.bookList[i]?.images?.length; j++) {
            let imgSrc = this.fileService.getImages(
              this.bookList[i].images[j].path
            );
            // console.log("imageSrc", imgSrc)
            this.bookList[i].imagesSrc?.push(imgSrc);
          }
          // console.log("listBookTitle", this.bookInCart[0].imagesSrc)
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
    console.log(event);
    this.pageCurrent = event;
    this.router.navigate(["/sys/statistic/book"], {
      queryParams: { page: this.pageCurrent },
    });
  }
}
