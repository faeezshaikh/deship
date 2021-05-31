import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackagedetailsPageRoutingModule } from './packagedetails-routing.module';

import { PackagedetailsPage } from './packagedetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackagedetailsPageRoutingModule
  ],
  declarations: [PackagedetailsPage]
})
export class PackagedetailsPageModule {}
