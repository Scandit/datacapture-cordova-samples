import { Component, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { UnitNumber } from 'src/app/models/unit-number.model';
import { SettingsField } from 'src/app/config';

@Component({
  selector: 'app-unit-number-item',
  templateUrl: './unit-number-item.component.html',
  styleUrls: ['./unit-number-item.component.scss'],
})
export class UnitNumberItemComponent {

  @Input() field: SettingsField;
  @Input() currentValue: UnitNumber;

  constructor(protected platform: Platform) {}

  public get isIos() {
    return this.platform.is('ios');
  }

  public get lines() {
    return this.isIos ? 'full' : 'none';
  }

}
