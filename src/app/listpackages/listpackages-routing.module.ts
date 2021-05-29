import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListpackagesPage } from './listpackages.page';

const routes: Routes = [
  {
    path: '',
    component: ListpackagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListpackagesPageRoutingModule {}
