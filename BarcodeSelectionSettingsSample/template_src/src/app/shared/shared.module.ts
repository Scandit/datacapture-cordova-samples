import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {
  FlatSelectComponent,
  MultipleFlatSelectComponent,
  NumberInputComponent,
  SelectComponent,
  SliderComponent,
  ToggleComponent,
} from './controls';
import { SettingsHeaderComponent } from './settings-header/settings-header.component';

const components = [
  SettingsHeaderComponent,

  FlatSelectComponent,
  MultipleFlatSelectComponent,
  SelectComponent,
  SliderComponent,
  ToggleComponent,
  NumberInputComponent,
];

@NgModule({
  declarations: [...components],
  entryComponents: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [...components],
})
export class SharedModule {}
