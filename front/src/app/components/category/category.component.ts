import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonConstant } from "src/app/_constant/common.constants";
import { Sys0202Service } from "src/app/_service/sys/book/sys0202.service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { GenreBook } from "src/app/_model/models/genreBook.model";
declare var window: any;

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent implements OnInit, OnDestroy {
  formModalAdd: any;
  formModalUpdate: any;

  listGenereBook: GenreBook[];
  groupGenreBook: GenreBook[][] = [];
  selectedGenreBook = new GenreBook();

  isModalVisible: boolean = true;
  subscriptions: Subscription[] = [];

  nameSearch: string = "";

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 20;
  tableSizes: any = [2, 4, 6, 8];

  @ViewChild("genreInput") genreInput: ElementRef; // Biến tham chiếu
  @ViewChild("genreChangeInput") genreChangeInput: ElementRef; // Biến tham chiếu

  constructor(
    private sys0202Service: Sys0202Service,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.sys0202Service
        .countTotalGenreBook(this.nameSearch)
        .subscribe((data) => {})
    );

    this.subscriptions.push(
      this.sys0202Service.getQuantityGenreBooks().subscribe((quantity) => {
        if (quantity.valueOf() % 20 === 0) {
          this.maxPage = quantity.valueOf() / 20;
        } else {
          this.maxPage = Math.floor(quantity.valueOf() / 20) + 1;
        }
      })
    );

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"));
      // this.statusSearch = (param.get("status")) ?? ""
      this.nameSearch = param.get("name") ?? "";
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1;
      }

      this.listGenereBook = [];
      this.groupGenreBook = [];

      this.sys0202Service
        .getListCateBookLimit(this.pageCurrent, this.nameSearch)
        .subscribe((data) => {});

      this.sys0202Service
        .countTotalGenreBook(this.nameSearch)
        .subscribe((data) => {});
    });

    this.sys0202Service.getGenreBooks().subscribe((genreBook) => {
      this.listGenereBook = [];
      this.groupGenreBook = [];
      this.listGenereBook = genreBook;
      for (let i = 0; i < this.listGenereBook.length; i += 10) {
        const group = this.listGenereBook.slice(i, i + 10);
        this.groupGenreBook.push(group);
      }
    });

    this.formModalAdd = new window.bootstrap.Modal(
      document.getElementById("modal-add-cat")
    );

    this.formModalUpdate = new window.bootstrap.Modal(
      document.getElementById("modal-update-cat")
    );
  }

  closeModal() {
    this.formModalAdd.hide();
  }

  openModalUpdate(genreBook: GenreBook) {
    this.selectedGenreBook = genreBook;
    this.formModalUpdate.show();
  }

  closeModalUpdate() {
    this.formModalUpdate.hide();
  }

  addGenreBook() {
    const inputValue: string = this.genreInput.nativeElement.value;
    const genreBook: GenreBook = {
      // status: this.selectedStatus,
      genre_name: inputValue,
    };
    this.sys0202Service.addGenreBook(genreBook).subscribe((resp) => {
      if (resp.status == CommonConstant.RESULT_OK) {
        this.toastr.success("Thêm loại sách thành công!");
        this.closeModal();
        // this.statusSearch = genreBook.status ?? ""
        this.sys0202Service
          .getListCateBookLimit(this.pageCurrent, this.nameSearch)
          .subscribe((data) => {});

        this.sys0202Service
          .countTotalGenreBook(this.nameSearch)
          .subscribe((data) => {});
      } else {
        this.toastr.error("Loại sách đã tồn tại!");
        this.closeModal();
      }
    });
  }

  updateGenreBook(genreBook: GenreBook) {
    this.sys0202Service.updateGenreBook(genreBook).subscribe((resp) => {
      if (resp.status == CommonConstant.RESULT_OK) {
        this.toastr.success("Cập nhật loại sách thành công!");
        this.closeModalUpdate();
      } else if (resp.status == CommonConstant.RESULT_NG) {
        this.toastr.error("Loại sách đã tồn tại");
        this.sys0202Service
          .getListCateBookLimit(this.pageCurrent, this.nameSearch)
          .subscribe((data) => {});

        this.sys0202Service
          .countTotalGenreBook(this.nameSearch)
          .subscribe((data) => {});
      }
    });
  }

  appendQueryParam(page: Number) {
    if (page != 0) {
      this.router.navigate(["/sys/list-categories"], {
        queryParams: { page: page, name: this.nameSearch },
      });
    }
  }

  search() {
    this.router.navigate(["/sys/list-categories"], {
      queryParams: { page: this.pageCurrent, name: this.nameSearch },
    });
  }

  showBookTitleByGenre(genreBook: GenreBook) {
    this.router.navigate(["/sys/list-categories", genreBook.genre_id], {
      queryParams: { page: 1 },
    });
  }

  changePage(event: any): void {
    this.pageCurrent = event;
    this.router.navigate(["/sys/list-categories"], {
      queryParams: { page: this.pageCurrent },
    });
  }
}
