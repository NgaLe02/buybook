import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user.component";
import { UserRoutingModule } from "./user-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CartComponent } from "src/app/components/cart/cart.component";
import { LayoutsModule } from "src/app/components/layouts/layouts.module";
import { SharedModule } from "src/app/components/shared/shared.module";
import { WaitListComponent } from "src/app/components/waitlist/waitlist.component";
import { NotificationsComponent } from "src/app/components/notifications/notifications.component";
import { User0101Service } from "src/app/_service/user/user0101.service";
import { QuanliphieumuonUserComponent } from "src/app/components/quanliphieumuon-user/quanliphieumuon-user.component";
import { ListDangMuonComponent } from "src/app/components/quanliphieumuon-user/list-dang-muon/list-dang-muon.component";
import { ListXacNhanComponent } from "src/app/components/quanliphieumuon-user/list-xac-nhan/list-xac-nhan.component";
import { ListDaTraComponent } from "src/app/components/quanliphieumuon-user/list-da-tra/list-da-tra.component";
import { ListDaHuyComponent } from "src/app/components/quanliphieumuon-user/list-da-huy/list-da-huy.component";
import { ProductByGenreComponent } from "src/app/components/productByGenre/productByGenre.component";
import { SharedPipeModule } from "src/app/_pipe/sharedpipe.module";
import { NgxPaginationModule } from "ngx-pagination";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { StarRatingModule } from "angular-star-rating";
import { NgxStarRatingModule } from "ngx-star-rating";
import { PhieuDanhGiaComponent } from "src/app/components/quanliphieumuon-user/phieu-danh-gia/phieu-danh-gia.component";

@NgModule({
  declarations: [
    // UserInfoComponent,
    UserComponent,
    CartComponent,
    WaitListComponent,
    NotificationsComponent,
    QuanliphieumuonUserComponent,
    ListDangMuonComponent,
    ListXacNhanComponent,
    ListDaTraComponent,
    ListDaHuyComponent,
    ProductByGenreComponent,
    PhieuDanhGiaComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    LayoutsModule,
    SharedModule,
    SharedPipeModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CKEditorModule,
    NgbModule,
    NgxStarRatingModule,
  ],
  providers: [User0101Service],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
