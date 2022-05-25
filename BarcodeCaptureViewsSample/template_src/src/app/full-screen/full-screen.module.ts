import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FullScreenPageRoutingModule } from './full-screen-routing.module';
import { FullScreenPage } from './full-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullScreenPageRoutingModule
  ],
  declarations: [FullScreenPage]
})
export class FullScreenPageModule {}
