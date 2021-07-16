import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';
import { BarcodeCaptureSymbologiesForm } from 'src/app/models';

@Component({
  selector: 'app-symbologies',
  templateUrl: './symbologies.component.html',
  styleUrls: ['./symbologies.component.scss'],
})
export class SymbologiesComponent extends SettingsBase implements OnInit {

  public form: BarcodeCaptureSymbologiesForm;
  public symbologies: string[] = [];

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

    this.form = this.settingsService.symbologiesForm;
    this.symbologies = Object.keys(this.form.controls);
  }

  public toggleAll(enabled: boolean) {
    Object.values(this.form.controls).forEach(control => control.patchValue({ enabled }));
  }

}
