import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Platform } from '@ionic/angular';
import { SettingsFieldName } from 'src/app/config';
import { ControlBase } from '../control-base';

@Component({
  selector: 'app-multiple-flat-select',
  templateUrl: './multiple-flat-select.component.html',
  styleUrls: ['./multiple-flat-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultipleFlatSelectComponent),
    multi: true,
  }]
})
export class MultipleFlatSelectComponent extends ControlBase<string> {

  @Input() formControlName: SettingsFieldName;

  constructor(protected platform: Platform) {
    super(platform);
  }

}
