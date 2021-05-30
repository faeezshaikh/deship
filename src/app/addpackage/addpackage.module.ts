import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddpackagePageRoutingModule } from './addpackage-routing.module';

import { AddpackagePage } from './addpackage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddpackagePageRoutingModule
  ],
  declarations: [AddpackagePage]
})
export class AddpackagePageModule {}
