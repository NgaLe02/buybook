import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { DashboardsComponent } from "./dashboards.component";
import { HomeComponent } from "src/app/components/home/home.component";
import { LayoutsModule } from "src/app/components/layouts/layouts.module";
import { SharedModule } from "src/app/components/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { ContentPdf } from "src/app/components/contentPdf/contentPdf.component";
import { ProductComponent } from "src/app/components/product/product.component";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { SharedPipeModule } from "src/app/_pipe/sharedpipe.module";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxStarRatingModule } from "ngx-star-rating";
import { NgImageSliderModule } from "ng-image-slider";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { ContentPdf2 } from "src/app/components/contentPdf/contentPdf2.component";

@NgModule({
  declarations: [
    DashboardsComponent,
    HomeComponent,
    ContentPdf,
    ContentPdf2,
    ProductComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DashboardsRoutingModule,
    LayoutsModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedPipeModule.forRoot(),
    RouterModule,
    NgxStarRatingModule,
    NgbModule,
    NgImageSliderModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardsModule {}
