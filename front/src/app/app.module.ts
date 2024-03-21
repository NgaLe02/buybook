import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HttpErrorInterceptor } from "./_config/http-error.interceptor";
import { ToastrModule } from "ngx-toastr";
import { AppComponent } from "./app.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserInfoComponent } from "./pages/user/user-info/user-info.component";
import { SearchService } from "./_service/comm/common.service";
import { DetailComponent } from "./components/phieumuon/detail-phieu-tra/detail.component";
import { TrasachComponent } from "./components/phieumuon/trasach/trasach.component";
import { ChiTietComponent } from "./components/phieumuon/chi-tiet/chi-tiet.component";
import { DetailPhieumuonUserComponent } from "./components/quanliphieumuon-user/detail-phieumuon-user/detail-phieumuon-user.component";
import { SharedPipeModule } from "./_pipe/sharedpipe.module";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [
    AppComponent,
    UserInfoComponent,
    TrasachComponent,
    DetailComponent,
    ChiTietComponent,
    DetailPhieumuonUserComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    SearchService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    SharedPipeModule.forRoot(),
  ],
})
export class AppModule {}
