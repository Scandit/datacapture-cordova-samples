import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BarcodeSelectionPointOfInterestForm } from 'src/app/models';
import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-bs-point-of-interest',
  templateUrl: './bs-point-of-interest.component.html',
  styleUrls: ['./bs-point-of-interest.component.scss'],
})
export class BSPointOfInterestComponent extends SettingsBase implements OnInit {

  public form: BarcodeSelectionPointOfInterestForm;

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

    const { form: formName } = this.route?.snapshot?.data;
    this.form = this.settingsService[formName];
  }

}
