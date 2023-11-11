import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';

import { UiService } from 'src/app/services/ui.service';
import { SettingsField, SettingsFieldOption } from '../../../config';
import { SettingsBase } from '../settings-base';
import { SettingsService } from 'src/app/services';
import { UnitNumber } from 'src/app/models/unit-number.model';

declare var Scandit;

@Component({
  selector: 'app-unit-number',
  templateUrl: './unit-number.component.html',
  styleUrls: ['./unit-number.component.scss'],
})
export class UnitNumberComponent extends SettingsBase implements OnInit {

  public parentForm: FormGroup;
  public form: FormGroup;
  public field: SettingsField;

  public units: SettingsFieldOption<string>[] = [
    { label: Scandit.MeasureUnit.DIP.toUpperCase(), value: Scandit.MeasureUnit.DIP },
    { label: Scandit.MeasureUnit.Fraction.toUpperCase(), value: Scandit.MeasureUnit.Fraction },
    { label: Scandit.MeasureUnit.Pixel.toUpperCase(), value: Scandit.MeasureUnit.Pixel },
  ];

  constructor(
    protected route: ActivatedRoute,
    protected platform: Platform,
    protected uiService: UiService,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
  ) {
    super(route, platform, uiService);
  }

  ngOnInit() {
    super.ngOnInit();
    const { form: formName, fieldName } = this.route?.snapshot?.data;

    this.field = this.getField<UnitNumber>(fieldName);
    this.parentForm = this.settingsService[formName];
    this.form = this.formBuilder.group({
      value: [
        this.parentForm.value[this.field.key]?.value || this.field.defaultValue.value,
        Validators.compose([
          Validators.max(this.field.max),
          Validators.min(this.field.min)
        ])
      ],
      unit: [this.parentForm.value[this.field.key]?.unit || this.field.defaultValue.unit],
    });

    this.form.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => this.parentForm.controls[this.field.key].patchValue(value));
  }

}
