import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';
import { ViewGesturesForm } from 'src/app/models';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-controls',
  templateUrl: './gestures.component.html',
  styleUrls: ['./gestures.component.scss'],
})
export class GesturesComponent extends SettingsBase implements OnInit {

  public form: ViewGesturesForm;

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

    this.form = this.settingsService.gesturesForm;
  }

}
