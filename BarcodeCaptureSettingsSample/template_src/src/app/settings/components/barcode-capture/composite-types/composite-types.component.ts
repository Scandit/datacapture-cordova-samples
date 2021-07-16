import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';
import { BarcodeCaptureCompositeTypesForm } from 'src/app/models';

@Component({
  selector: 'app-composite-types',
  templateUrl: './composite-types.component.html',
  styleUrls: ['./composite-types.component.scss'],
})
export class CompositeTypesComponent extends SettingsBase implements OnInit {

  public form: BarcodeCaptureCompositeTypesForm;

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

    this.form = this.settingsService.compositeTypes;
  }

}
