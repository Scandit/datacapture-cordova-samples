import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SplitScreenPage } from './split-screen.page';

const routes: Routes = [
  {
    path: '',
    component: SplitScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitScreenPageRoutingModule {}
