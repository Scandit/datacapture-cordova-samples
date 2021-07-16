import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanComponent } from './scan.component';

const routes: Routes = [
  {
    path: '',
    component: ScanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanPageRoutingModule {}
