import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Platform } from '@ionic/angular';
import { SettingsFieldName } from 'src/app/config';
import { ControlBase } from '../control-base';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }]
})
export class SelectComponent extends ControlBase<string> {

  @Input() formControlName: SettingsFieldName;

  constructor(protected platform: Platform) {
    super(platform);
  }

}
