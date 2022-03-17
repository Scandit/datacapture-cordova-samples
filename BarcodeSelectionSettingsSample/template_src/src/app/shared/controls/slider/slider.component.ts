import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Platform } from '@ionic/angular';
import { SettingsFieldName } from 'src/app/config';
import { ControlBase } from '../control-base';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true,
  }]
})
export class SliderComponent extends ControlBase<number> {

  @Input() formControlName: SettingsFieldName;

  constructor(protected platform: Platform) {
    super(platform);
  }

}
