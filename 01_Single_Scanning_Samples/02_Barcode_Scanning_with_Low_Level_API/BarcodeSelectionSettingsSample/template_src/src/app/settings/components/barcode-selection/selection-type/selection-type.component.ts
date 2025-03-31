import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SettingsField, SettingsFieldName } from 'src/app/config';
import { BarcodeSelectionSelectionTypeForm } from 'src/app/models';
import { SettingsService, UiService } from 'src/app/services';

import { SettingsBase } from '../../settings-base';

@Component({
  selector: 'app-selection-type',
  templateUrl: './selection-type.component.html',
  styleUrls: ['./selection-type.component.scss'],
})
export class SelectionTypeComponent extends SettingsBase implements OnInit {

  public form: BarcodeSelectionSelectionTypeForm;
  public selectionType: SettingsField;
  public freezeBehaviour: SettingsField;
  public tapBehaviour: SettingsField;
  public selectionStrategy: SettingsField;

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

    this.form = this.settingsService.selectionTypeForm;

    this.selectionType = this.getField(SettingsFieldName.SELECTION_TYPE);
    this.freezeBehaviour = this.getField(SettingsFieldName.FREEZE_BEHAVIOUR);
    this.tapBehaviour = this.getField(SettingsFieldName.TAP_BEHAVIOUR);
    this.selectionStrategy = this.getField(SettingsFieldName.SELECTION_STRATEGY);
  }

}
