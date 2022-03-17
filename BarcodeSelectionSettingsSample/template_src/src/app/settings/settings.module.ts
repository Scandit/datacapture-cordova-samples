import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../shared/shared.module';
import {
  BSPointOfInterestComponent,
  CameraComponent,
  CodeDuplicateFilterComponent,
  FeedbackComponent,
  MainSettingsComponent,
  OverlayComponent,
  PointOfInterestComponent,
  ScanAreaComponent,
  SelectionTypeComponent,
  SettingsListComponent,
  SingleBarcodeAutoDetectionComponent,
  SymbologiesComponent,
  SymbologyComponent,
  SymbologyItemComponent,
  UnitNumberComponent,
  UnitNumberItemComponent,
  ViewfinderComponent,
} from './components';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

const components = [
  SettingsComponent,
  MainSettingsComponent,
  CameraComponent,
  SelectionTypeComponent,
  FeedbackComponent,
  SingleBarcodeAutoDetectionComponent,
  CodeDuplicateFilterComponent,
  SymbologiesComponent,
  BSPointOfInterestComponent,

  OverlayComponent,
  PointOfInterestComponent,
  ScanAreaComponent,
  ViewfinderComponent,

  SettingsListComponent,
  UnitNumberComponent,
  UnitNumberItemComponent,
  SymbologyComponent,
  SymbologyItemComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    SettingsPageRoutingModule,
  ],
  declarations: [...components],
  exports: [...components],
})
export class SettingsPageModule {}
