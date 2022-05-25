import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FullScreenPage } from './full-screen.page';

const routes: Routes = [
  {
    path: '',
    component: FullScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FullScreenPageRoutingModule {}
