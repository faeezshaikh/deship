import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListpackagesPageRoutingModule } from './listpackages-routing.module';

import { ListpackagesPage } from './listpackages.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListpackagesPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ListpackagesPage]
})
export class ListpackagesPageModule {}
