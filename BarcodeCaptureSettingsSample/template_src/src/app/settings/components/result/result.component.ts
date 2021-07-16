import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';
import { ResultForm } from 'src/app/models';

import { SettingsBase } from '../settings-base';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent extends SettingsBase implements OnInit {

  public form: ResultForm;

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

    this.form = this.settingsService.resultForm;
  }

}
