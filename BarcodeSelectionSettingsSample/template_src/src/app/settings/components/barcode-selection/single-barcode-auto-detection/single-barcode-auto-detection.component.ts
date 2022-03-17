import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BarcodeSelectionSingleBarcodeAutoDetectionForm } from 'src/app/models';
import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-single-barcode-auto-detection',
  templateUrl: './single-barcode-auto-detection.component.html',
  styleUrls: ['./single-barcode-auto-detection.component.scss'],
})
export class SingleBarcodeAutoDetectionComponent extends SettingsBase implements OnInit {

  public form: BarcodeSelectionSingleBarcodeAutoDetectionForm;

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

    this.form = this.settingsService.singleBarcodeAutoDetectionForm;
  }

}
