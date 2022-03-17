import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ViewViewfinderForm } from 'src/app/models';
import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-viewfinder',
  templateUrl: './viewfinder.component.html',
  styleUrls: ['./viewfinder.component.scss'],
})
export class ViewfinderComponent extends SettingsBase implements OnInit {

  public form: ViewViewfinderForm;

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

    this.form = this.settingsService.viewfinderForm;
  }

}
