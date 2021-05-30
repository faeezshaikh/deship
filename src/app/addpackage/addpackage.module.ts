import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';

import { AddpackagePageRoutingModule } from './addpackage-routing.module';

import { AddpackagePage } from './addpackage.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddpackagePageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AddpackagePage]
})
export class AddpackagePageModule {}
