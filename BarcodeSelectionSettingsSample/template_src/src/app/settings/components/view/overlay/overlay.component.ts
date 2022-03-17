import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SettingsField, SettingsFieldName } from 'src/app/config';
import { ViewOverlayForm } from 'src/app/models';
import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent extends SettingsBase implements OnInit {

  public form: ViewOverlayForm;

  public style: SettingsField;

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

    this.form = this.settingsService.overlayForm;

    this.style = this.getField(SettingsFieldName.OVERLAY_STYLE);
  }

}
