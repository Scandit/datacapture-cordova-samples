import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';
import { ViewScanAreaForm } from 'src/app/models';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-scan-area',
  templateUrl: './scan-area.component.html',
  styleUrls: ['./scan-area.component.scss'],
})
export class ScanAreaComponent extends SettingsBase implements OnInit {

  public form: ViewScanAreaForm;

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

    this.form = this.settingsService.scanAreaForm;
  }

}
