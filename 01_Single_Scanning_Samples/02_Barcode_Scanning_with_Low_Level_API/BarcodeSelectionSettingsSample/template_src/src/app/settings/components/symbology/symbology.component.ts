import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BarcodeSelectionSymbologyForm } from 'src/app/models';
import { SettingsService } from 'src/app/services';
import { UiService } from 'src/app/services/ui.service';

import { SettingsField } from '../../../config';
import { SettingsBase } from '../settings-base';

@Component({
  selector: 'app-symbology',
  templateUrl: './symbology.component.html',
  styleUrls: ['./symbology.component.scss'],
})
export class SymbologyComponent extends SettingsBase implements OnInit {

  public form: BarcodeSelectionSymbologyForm;
  public field: SettingsField;
  public symbology: string;
  public description;

  public enabledExtensions = {};
  public minOptions = [];
  public maxOptions = [];

  public get supportedExtensions(): string[] | null {
    return this.description.supportedExtensions?.filter((extension: string) => !extension.includes("add_on"));
  }

  constructor(
    protected route: ActivatedRoute,
    protected platform: Platform,
    protected uiService: UiService,
    private settingsService: SettingsService,
  ) {
    super(route, platform, uiService);
  }

  public ngOnInit() {
    this.symbology = this.route?.snapshot?.params?.symbology;
    this.description = this.settingsService.symbologies?.[this.symbology]?.description;
    this.uiService.settingsLabel$.next(this.description?.readableName);
    this.form = this.settingsService.symbologiesForm.controls[this.symbology] as BarcodeSelectionSymbologyForm;

    this.setMinOptions();
    this.setMaxOptions();
  }

  public onMinimumValueChange(value: number) {
    this.form.patchValue({ minimum: value });
    this.setMaxOptions();
  }

  public onMaximumValueChange(value: number) {
    this.form.patchValue({ maximum: value });
    this.setMinOptions();
  }

  public onExtensionsToggle(extension: string) {
    const currentExtensions = this.form.value.extensions;
    const isSelected = currentExtensions.includes(extension);
    const extensions: string[] = isSelected ?
      currentExtensions.filter((item: string) => item !== extension) :
      [...currentExtensions, extension];

    this.form.patchValue({ extensions });
  }

  public onColorInvertedClick(event: MouseEvent) {
    this.toggle(event, 'colorInverted');
  }

  public onEnabledClick(event: MouseEvent) {
    this.toggle(event, 'enabled');
  }

  private toggle(event: MouseEvent, fieldName: string) {
    event.stopPropagation();
    event.stopImmediatePropagation();

    this.form.patchValue({ [fieldName]: !this.form.value[fieldName] });
  }

  private setMinOptions() {
    const min = this.description.activeSymbolCountRange.minimum;
    const max = Math.min(this.description.activeSymbolCountRange.maximum + 1, this.form.value.maximum + 1);

    this.minOptions = new Array(max - min).fill(0).map((_, index) => min + index);
  }

  private setMaxOptions() {
    const min = Math.max(this.description.activeSymbolCountRange.minimum, this.form.value.minimum);
    const max = this.description.activeSymbolCountRange.maximum;

    this.maxOptions = new Array(max + 1 - min).fill(0).map((_, index) => min + index);
  }


}
