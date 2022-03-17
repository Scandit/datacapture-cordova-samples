import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Platform } from '@ionic/angular';
import { SettingsFieldName } from 'src/app/config';
import { ControlBase } from '../control-base';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberInputComponent),
    multi: true,
  }]
})
export class NumberInputComponent extends ControlBase<number> {

  @Input() formControlName: SettingsFieldName;

  constructor(protected platform: Platform) {
    super(platform);
  }

}
