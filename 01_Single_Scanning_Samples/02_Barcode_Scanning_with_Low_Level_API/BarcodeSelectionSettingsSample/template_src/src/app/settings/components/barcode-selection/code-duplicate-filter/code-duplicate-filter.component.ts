import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BarcodeSelectionCodeDuplicateFilterForm } from 'src/app/models';
import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-code-duplicate-filter',
  templateUrl: './code-duplicate-filter.component.html',
  styleUrls: ['./code-duplicate-filter.component.scss'],
})
export class CodeDuplicateFilterComponent extends SettingsBase implements OnInit {

  public form: BarcodeSelectionCodeDuplicateFilterForm;

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

    this.form = this.settingsService.codeDuplicateFilterForm;
  }

}
