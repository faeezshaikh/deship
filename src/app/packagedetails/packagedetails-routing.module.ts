import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackagedetailsPage } from './packagedetails.page';

const routes: Routes = [
  {
    path: '',
    component: PackagedetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackagedetailsPageRoutingModule {}
