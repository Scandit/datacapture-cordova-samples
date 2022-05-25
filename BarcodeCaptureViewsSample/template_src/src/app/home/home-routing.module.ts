import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'full-screen',
    loadChildren: () => import('../full-screen/full-screen.module').then( m => m.FullScreenPageModule)
  },
  {
    path: 'split-screen',
    loadChildren: () => import('../split-screen/split-screen.module').then( m => m.SplitScreenPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('../modal/modal.module').then( m => m.ModalPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
