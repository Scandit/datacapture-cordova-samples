import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';

import { UiService } from 'src/app/services/ui.service';

import {
  NavigationItem,
  SettingsFieldType,
  settingsFields,
  SettingsFieldName,
  SettingsFields,
  SettingsField,
} from '../../config';

declare var Scandit;

export class SettingsBase implements OnInit, OnDestroy {

  protected destroyed$ = new Subject<boolean>();

  public items$: Observable<NavigationItem[]>;
  public fields = settingsFields(Scandit);
  public fieldName = SettingsFieldName;
  public fieldTypes = SettingsFieldType;

  constructor(
    protected route: ActivatedRoute,
    protected platform: Platform,
    protected uiService: UiService,
  ) {}

  public ngOnInit() {
    this.uiService.settingsLabel$.next(this.route?.snapshot?.data?.label);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public get isIos() {
    return this.platform.is('ios');
  }

  public get lines() {
    return this.isIos ? 'full' : 'none';
  }

  public getField<T = any>(field: SettingsFieldName): SettingsField<T> {
    return this.fields[field];
  }

  public getFields(fields: SettingsFieldName[]) {
    return fields.reduce(
      (value, field) => ({
        ...value,
        [field]: this.getField(field)
      }),
      {} as SettingsFields
    );
  }

}
