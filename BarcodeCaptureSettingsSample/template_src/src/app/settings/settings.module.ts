import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SharedModule } from '../shared/shared.module';

import {
  ResultComponent,
  FeedbackComponent,
  CodeDuplicateFilterComponent,
  CompositeTypesComponent,
  SymbologiesComponent,
  LocationSelectionComponent,
  CameraComponent,

  ControlsComponent,
  GesturesComponent,
  LogoComponent,
  OverlayComponent,
  PointOfInterestComponent,
  ScanAreaComponent,
  ViewfinderComponent,

  SettingsListComponent,
  UnitNumberComponent,
  UnitNumberItemComponent,
  SymbologyComponent,
  SymbologyItemComponent,
} from './components';

const components = [
  SettingsComponent,
  ResultComponent,
  CameraComponent,
  LocationSelectionComponent,
  FeedbackComponent,
  CodeDuplicateFilterComponent,
  CompositeTypesComponent,
  SymbologiesComponent,

  ControlsComponent,
  GesturesComponent,
  LogoComponent,
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
