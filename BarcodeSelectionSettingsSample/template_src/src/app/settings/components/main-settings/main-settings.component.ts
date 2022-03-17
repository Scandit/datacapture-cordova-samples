import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from 'src/app/services';
import { UiService } from 'src/app/services/ui.service';

import { NavigationItem } from '../../../config';
import { SettingsBase } from '../settings-base';

declare var Scandit;

@Component({
  selector: 'app-main-settings',
  templateUrl: './main-settings.component.html',
  styleUrls: ['./main-settings.component.scss'],
})
export class MainSettingsComponent extends SettingsBase implements OnInit {

  public items$: Observable<NavigationItem[]>;

  public version: string;

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
    this.items$ = this.route.data.pipe(map(data => data?.items));
    this.settingsService.reset = false;
    this.version = Scandit.DataCaptureVersion.pluginVersion;
  }

  public resetBarcodeSelection() {
    this.settingsService.reset = true;
  }
}
