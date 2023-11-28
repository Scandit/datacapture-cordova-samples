import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FooterComponent } from './footer/footer.component';
import { SettingsHeaderComponent } from './settings-header/settings-header.component';
import {
  FlatSelectComponent,
  MultipleFlatSelectComponent,
  SelectComponent,
  SliderComponent,
  ToggleComponent,
  NumberInputComponent
} from './controls';

const components = [
  FooterComponent,
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
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [],
    exports: [...components]
})
export class SharedModule {}
