import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { DashboardsComponent } from './dashboards.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { LayoutsModule } from 'src/app/components/layouts/layouts.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { ProductComponent } from 'src/app/components/product/product.component';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    DashboardsComponent,
    HomeComponent,
    // ProductComponent,
  ],
  imports: [
    CommonModule,
    DashboardsRoutingModule,
    LayoutsModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DashboardsModule { }
