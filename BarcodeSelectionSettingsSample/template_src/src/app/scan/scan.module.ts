import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ScanComponent } from './scan.component';
import { ScanPageRoutingModule } from './scan-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanPageRoutingModule,
  ],
  declarations: [ScanComponent]
})
export class ScanPageModule {}
