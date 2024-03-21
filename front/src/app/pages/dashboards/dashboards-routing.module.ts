import { ContentPdf2 } from "./../../components/contentPdf/contentPdf2.component";
import { ProductComponent } from "./../../components/product/product.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardsComponent } from "./dashboards.component";
import { HomeComponent } from "src/app/components/home/home.component";
import { ContentPdf } from "src/app/components/contentPdf/contentPdf.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardsComponent,
    children: [
      { path: "", component: HomeComponent },
      // { path: "genre/:id", component: HomeComponent },
      { path: "book/:id", component: ProductComponent },
      { path: "book/ebook/:id", component: ContentPdf2 },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
