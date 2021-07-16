import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../settings-base';
import { SettingsField, SettingsFieldName, SettingsFields } from '../../../config';
import { CameraForm } from 'src/app/models';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent extends SettingsBase implements OnInit {

  public fields: SettingsFields;

  public cameraPosition: SettingsField;
  public maxFrameRate: SettingsField;

  public zoomFactor: SettingsField;
  public zoomGestureZoomFactor: SettingsField;

  public form: CameraForm;

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

    this.cameraPosition = this.getField(SettingsFieldName.CAMERA_POSITION);

    this.form = this.settingsService.cameraForm;
  }


}
