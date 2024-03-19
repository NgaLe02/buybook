import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

import { SysRoutingModule } from "./sys-routing.module";
import { Sys0201Component } from "./Sys0201/sys0201.component";
import { SysComponent } from "./sys.component";
import { BookTitleComponent } from "src/app/components/bookTitle/booktitlelist/booktitle.component";
import { AddBookTitleComponent } from "src/app/components/bookTitle/addbooktitle/addbooktitle.component";
import { FormsModule } from "@angular/forms";
import { CategoryComponent } from "src/app/components/category/category.component";
import { PhieumuonComponent } from "src/app/components/phieumuon/phieumuon.component";

import { CheckoutComponent } from "src/app/components/checkout/checkout.component";
import { LayoutsModule } from "src/app/components/layouts/layouts.module";
import { UserManageModule } from "src/app/components/user_manage/usermanage.module";
import { ListChoComponent } from "src/app/components/phieumuon/list-cho/list-cho.component";
import { ListDangMuonComponent } from "src/app/components/phieumuon/list-dang-muon/list-dang-muon.component";
import { ListDaTraComponent } from "src/app/components/phieumuon/list-da-tra/list-da-tra.component";
import { ListDaHuyComponent } from "src/app/components/phieumuon/list-da-huy/list-da-huy.component";
import { SysBookDetailComponent } from "src/app/components/bookTitle/bookdetail/bookdetail.component";
import { EditBookTitleComponent } from "src/app/components/bookTitle/editBookTitle/editBookTitle.component";
import { SharedPipeModule } from "src/app/_pipe/sharedpipe.module";
import { NgxPaginationModule } from "ngx-pagination";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { StatisticBookComponent } from "src/app/components/statistics/book/statistic-book.component";
import { StatisticComponent } from "src/app/components/statistics/statisitc.component";
import { StatisticUserComponent } from "src/app/components/statistics/user/statistic-user.component";
import { StatisticBookBorrowedComponent } from "src/app/components/statistics/user/book-borrowed/statistic-book-borrowed.component";
import { NgImageSliderModule } from "ng-image-slider";
import { StatisticUserBorrowComponent } from "src/app/components/statistics/book/user-borrow/statistic-user-borrow.component";

@NgModule({
  declarations: [
    SysComponent,
    BookTitleComponent,
    SysBookDetailComponent,
    AddBookTitleComponent,
    CheckoutComponent,
    CategoryComponent,
    PhieumuonComponent,
    ListChoComponent,
    ListDangMuonComponent,
    ListDaTraComponent,
    ListDaHuyComponent,
    EditBookTitleComponent,
    Sys0201Component,
    StatisticBookComponent,
    StatisticComponent,
    StatisticUserComponent,
    StatisticBookBorrowedComponent,
    StatisticUserBorrowComponent,
  ],
  imports: [
    CommonModule,
    SysRoutingModule,
    FormsModule,
    LayoutsModule,
    UserManageModule,
    NgxPaginationModule,
    SharedPipeModule,
    CKEditorModule,
    NgImageSliderModule,
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SysModule {}
