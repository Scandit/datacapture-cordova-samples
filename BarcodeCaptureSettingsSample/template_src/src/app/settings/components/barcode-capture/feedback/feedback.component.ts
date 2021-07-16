import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';
import { BarcodeCaptureFeedbackForm } from 'src/app/models';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent extends SettingsBase implements OnInit {

  public form: BarcodeCaptureFeedbackForm;

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

    this.form = this.settingsService.feedbackForm;
  }

}
