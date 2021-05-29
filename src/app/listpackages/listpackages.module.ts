import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListpackagesPageRoutingModule } from './listpackages-routing.module';

import { ListpackagesPage } from './listpackages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListpackagesPageRoutingModule
  ],
  declarations: [ListpackagesPage]
})
export class ListpackagesPageModule {}
