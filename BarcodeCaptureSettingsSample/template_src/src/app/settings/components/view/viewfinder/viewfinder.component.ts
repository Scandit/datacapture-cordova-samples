import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

import { SettingsService, UiService } from 'src/app/services';
import { ViewViewfinderForm } from 'src/app/models';
import { SettingsFieldName, SettingsField } from 'src/app/config';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-viewfinder',
  templateUrl: './viewfinder.component.html',
  styleUrls: ['./viewfinder.component.scss'],
})
export class ViewfinderComponent extends SettingsBase implements OnInit {

  public form: ViewViewfinderForm;
  public viewfinderType: SettingsField;

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

    this.viewfinderType = this.getField(SettingsFieldName.VIEWFINDER_TYPE);
  }

  public get type() {
    return this.form.value.VIEWFINDER_TYPE;
  }

  public get rectangularStyle() {
    return this.form.value.VIEWFINDER_STYLE;
  }

  public get sizeSpecification() {
    return this.form.value.VIEWFINDER_SIZE_SPECIFICATION;
  }

}
