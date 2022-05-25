import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SplitScreenPageRoutingModule } from './split-screen-routing.module';
import { SplitScreenPage } from './split-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplitScreenPageRoutingModule
  ],
  declarations: [SplitScreenPage]
})
export class SplitScreenPageModule {}
