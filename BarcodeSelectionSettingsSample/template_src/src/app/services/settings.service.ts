import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { fieldsStructure, SettingsFieldName, settingsFields } from '../config';
import {
  BarcodeSelectionCodeDuplicateFilterForm,
  BarcodeSelectionFeedbackForm,
  BarcodeSelectionForm,
  BarcodeSelectionPointOfInterestForm,
  BarcodeSelectionSelectionTypeForm,
  BarcodeSelectionSingleBarcodeAutoDetectionForm,
  BarcodeSelectionSymbologiesForm,
  CameraForm,
  EnumDictionary,
  SettingsForm,
  ViewForm,
  ViewOverlayForm,
  ViewPointOfInterestForm,
  ViewScanAreaForm,
  ViewViewfinderForm,
} from '../models';
import { isArray, isObject } from '../shared/utils';

declare var Scandit;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public settingsForm: SettingsForm;
  public symbologies;
  public reset = false;

  constructor(private formBuilder: UntypedFormBuilder) {

    const barcodeSelectionSettings = new Scandit.BarcodeSelectionSettings();
    this.symbologies = fieldsStructure(Scandit).barcodeSelection.symbologies
      .reduce((symbologies, symbology) => ({
        ...symbologies,
        [symbology]: {
          settings: barcodeSelectionSettings.settingsForSymbology(Scandit.Symbology[symbology]),
          description: new Scandit.SymbologyDescription(Scandit.Symbology[symbology]),
        },
      }), {});

    this.settingsForm = this.buildFormPart(fieldsStructure(Scandit)) as SettingsForm;
  }

  public get barcodeSelectionForm() {
    return this.settingsForm.controls.barcodeSelection as BarcodeSelectionForm;
  }

  public get symbologiesForm() {
    return this.barcodeSelectionForm.controls.symbologies as BarcodeSelectionSymbologiesForm;
  }

  public get barcodeSelectionPointOfInterestForm() {
    return this.barcodeSelectionForm.controls.pointOfInterest as BarcodeSelectionPointOfInterestForm;
  }

  public get selectionTypeForm() {
    return this.barcodeSelectionForm.controls.selectionType as BarcodeSelectionSelectionTypeForm;
  }

  public get feedbackForm() {
    return this.barcodeSelectionForm.controls.feedback as BarcodeSelectionFeedbackForm;
  }

  public get codeDuplicateFilterForm() {
    return this.barcodeSelectionForm.controls.codeDuplicateFilter as BarcodeSelectionCodeDuplicateFilterForm;
  }

  public get singleBarcodeAutoDetectionForm() {
    return this.barcodeSelectionForm.controls.singleBarcodeAutoDetection as BarcodeSelectionSingleBarcodeAutoDetectionForm;
  }

  public get cameraForm() {
    return this.settingsForm.controls.camera as CameraForm;
  }

  public get viewForm() {
    return this.settingsForm.controls.view as ViewForm;
  }

  public get scanAreaForm() {
    return this.viewForm.controls.scanArea as ViewScanAreaForm;
  }

  public get pointOfInterestForm() {
    return this.viewForm.controls.pointOfInterest as ViewPointOfInterestForm;
  }

  public get overlayForm() {
    return this.viewForm.controls.overlay as ViewOverlayForm;
  }

  public get viewfinderForm() {
    return this.viewForm.controls.viewfinder as ViewViewfinderForm;
  }

  private buildFormPart(config): any {
    if (isArray(config)) {
      return this.formBuilder.group(this.getFormConfigFromFields(config));
    }

    if (isObject(config)) {
      const group = Object.keys(config)
        .reduce((current, key) => ({ ...current, [key]: this.buildFormPart(config[key])}), {});

      return this.formBuilder.group(group);
    }
  }

  private getFormConfigFromFields(fields: SettingsFieldName[]) {
    return fields.reduce(
      (value, field) => ({
        ...value,
        [field]: this.getFieldConfig(field)
      }),
      {} as EnumDictionary<SettingsFieldName, UntypedFormControl>
    );
  }

  private getFieldConfig(field: SettingsFieldName) {
    if (Scandit.Symbology[field]) {
      const { description, settings: symbology } = this.symbologies[field];

      const enabled = { enabled: this.formBuilder.control(symbology.isEnabled) };
      const colorInverted = description.isColorInvertible ?
        { colorInverted: this.formBuilder.control(symbology.isColorInvertedEnabled) } : {};

      const hasExtensions = description.supportedExtensions?.length || symbology.enabledExtensions?.length;
      const extensions = hasExtensions ? { extensions: this.formBuilder.control(symbology.enabledExtensions) } : {};

      const rangeEnabled = description?.activeSymbolCountRange &&
        (description.activeSymbolCountRange.minimum || description.activeSymbolCountRange.maximum);

      const range = rangeEnabled ? {
        minimum: this.formBuilder.control(description.defaultSymbolCountRange.minimum),
        maximum: this.formBuilder.control(description.defaultSymbolCountRange.maximum),
      } : {};

      return this.formBuilder.group({
        ...enabled,
        ...colorInverted,
        ...extensions,
        ...range,
      });
    }

    return this.formBuilder.control(settingsFields(Scandit)[field].defaultValue);
  }

}
