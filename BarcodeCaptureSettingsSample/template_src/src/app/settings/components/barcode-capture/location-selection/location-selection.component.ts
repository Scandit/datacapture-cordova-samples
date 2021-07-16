import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';
import { BarcodeCaptureLocationSelectionForm } from 'src/app/models';
import { SettingsFieldName, SettingsField } from 'src/app/config';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-location-selection',
  templateUrl: './location-selection.component.html',
  styleUrls: ['./location-selection.component.scss'],
})
export class LocationSelectionComponent extends SettingsBase implements OnInit {

  public form: BarcodeCaptureLocationSelectionForm;
  public locationSelectionType: SettingsField;

  constructor(
    protected route: ActivatedRoute,
    protected platform: Platform,
    protected uiService: UiService,
    protected settingsService: SettingsService,
  ) {
    super(route, platform, uiService);
  }

  public ngOnInit() {
    super.ngOnInit();

    this.form = this.settingsService.locationSelectionForm;

    this.locationSelectionType = this.getField(SettingsFieldName.LOCATION_SELECTION_TYPE);
  }

  public get type() {
    return this.form.value.LOCATION_SELECTION_TYPE;
  }

  public get sizeSpecification() {
    return this.form.value.LOCATION_SELECTION_SIZE_SPECIFICATION;
  }

}
