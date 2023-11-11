import { OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import {
  settingsFields,
  SettingsFieldName,
  SettingsField,
} from '../../config';
import { ControlValueAccessor } from '@angular/forms';

type OnTouchFn = () => void;
type OnChangeFn = (value: any) => void;

declare var Scandit;

export class ControlBase<Type> implements OnInit, ControlValueAccessor {

  public field: SettingsField;
  public formControlName: SettingsFieldName;

  public value: Type;

  private onChange: OnChangeFn = () => null;
  private onTouch: OnTouchFn = () => null;

  constructor(
    protected platform: Platform,
  ) {}

  public writeValue(value: Type): void {
    this.value = value;
  }

  public ngOnInit() {
    this.field = this.getField(this.formControlName);
  }

  public get isIos() {
    return this.platform.is('ios');
  }

  public get lines() {
    return this.isIos ? 'full' : 'none';
  }

  public getField(field: SettingsFieldName) {
    return settingsFields(Scandit)[field];
  }

  public registerOnChange(fn: OnChangeFn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: OnTouchFn) {
    this.onTouch = fn;
  }

  public onValueChange(value: Type) {
    this.value = value;
    this.onChange(value);
  }

}
