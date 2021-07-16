import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FooterComponent } from './footer/footer.component';
import { SettingsHeaderComponent } from './settings-header/settings-header.component';
import {
  FlatSelectComponent,
  SelectComponent,
  SliderComponent,
  ToggleComponent,
  NumberInputComponent
} from './controls';

const components = [
  FooterComponent,
  SettingsHeaderComponent,

  FlatSelectComponent,
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
