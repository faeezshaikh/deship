import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddpackagePage } from './addpackage.page';






const routes: Routes = [
  {
    path: '',
    component: AddpackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddpackagePageRoutingModule {}
