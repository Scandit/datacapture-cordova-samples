import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Platform } from '@ionic/angular';
import { SettingsFieldName } from 'src/app/config';
import { ControlBase } from '../control-base';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true,
  }]
})
export class ToggleComponent extends ControlBase<boolean> {

  @Input() formControlName: SettingsFieldName;

  constructor(protected platform: Platform) {
    super(platform);
  }

  public onItemClick(event: MouseEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    this.onValueChange(!this.value);
  }

}
