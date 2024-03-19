import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DauSach } from "src/app/_model/models/book.model";
import { DataResponse } from "src/app/_model/resp/data-response";
import { FileService } from "src/app/_service/comm/file.service";
import { StatisticService } from "src/app/_service/sys/book/statisitcBook.service";

@Component({
  selector: "app-statistic-user",
  templateUrl: "./statistic-user-borrow.component.html",
  styleUrls: ["./statistic-user-borrow.component.css"],
})
export class StatisticUserBorrowComponent implements OnInit {
  imageToShowSrc: string[] = [];
  userList: UserInfo[] = [];
  bookCode: string = "";

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  constructor(
    private statistic: StatisticService,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
    });
    this.bookCode = "" + this.activatedRoute.snapshot.paramMap.get("bookCode");

    this.statistic.getUserBorrowOfBookToStatistic(this.bookCode).subscribe({
      next: (res: DataResponse) => {
        this.userList = [];
        this.userList = res.responseData as DauSach[];
        // console.log(this.bookList)
        this.imageToShowSrc = [];

        for (let i = 0; i < this.userList.length; i++) {
          if (this.userList[i].imgPath) {
            let imgSrc = this.fileService.getImages(this.userList[i].imgPath);
            this.imageToShowSrc.push(imgSrc);
          } else {
            let imgSrc = this.fileService.getImages("no-image.png");
            this.imageToShowSrc.push(imgSrc);
          }
        }
      },
    });
  }

  changePage(event: any): void {
    console.log(event);
    this.pageCurrent = event;
    this.router.navigate(["/sys/statistic/book/borrowed"], {
      queryParams: { page: this.pageCurrent },
    });
  }
}
