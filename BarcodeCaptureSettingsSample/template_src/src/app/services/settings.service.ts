import { Injectable } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SettingsFieldName, settingsFields, fieldsStructure } from '../config';
import {
  EnumDictionary,
  CameraForm,
  ViewForm,
  ViewScanAreaForm,
  ViewPointOfInterestForm,
  ViewOverlayForm,
  ViewViewfinderForm,
  ViewLogoForm,
  ViewControlsForm,
  ViewGesturesForm,
  ResultForm,
  SettingsForm,
  BarcodeCaptureForm,
  BarcodeCaptureFeedbackForm,
  BarcodeCaptureLocationSelectionForm,
  BarcodeCaptureSymbologiesForm,
  BarcodeCaptureCodeDuplicateFilterForm,
  BarcodeCaptureCompositeTypesForm,
} from '../models';
import { isObject, isArray } from '../shared/utils';

declare var Scandit;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public settingsForm: SettingsForm;
  public symbologies;

  constructor(private formBuilder: FormBuilder) {

    const barcodeCaptureSettings = new Scandit.BarcodeCaptureSettings();
    this.symbologies = fieldsStructure(Scandit).barcodeCapture.symbologies
      .reduce((symbologies, symbology) => ({
        ...symbologies,
        [symbology]: {
          settings: barcodeCaptureSettings.settingsForSymbology(Scandit.Symbology[symbology]),
          description: new Scandit.SymbologyDescription(Scandit.Symbology[symbology]),
        },
      }), {});

    this.settingsForm = this.buildFormPart(fieldsStructure(Scandit)) as SettingsForm;
  }

  public get barcodeCaptureForm() {
    return this.settingsForm.controls.barcodeCapture as BarcodeCaptureForm;
  }

  public get symbologiesForm() {
    return this.barcodeCaptureForm.controls.symbologies as BarcodeCaptureSymbologiesForm;
  }

  public get locationSelectionForm() {
    return this.barcodeCaptureForm.controls.locationSelection as BarcodeCaptureLocationSelectionForm;
  }

  public get feedbackForm() {
    return this.barcodeCaptureForm.controls.feedback as BarcodeCaptureFeedbackForm;
  }

  public get codeDuplicateFilterForm() {
    return this.barcodeCaptureForm.controls.codeDuplicateFilter as BarcodeCaptureCodeDuplicateFilterForm;
  }

  public get compositeTypes() {
    return this.barcodeCaptureForm.controls.compositeTypes as BarcodeCaptureCompositeTypesForm;
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

  public get logoForm() {
    return this.viewForm.controls.logo as ViewLogoForm;
  }

  public get controlsForm() {
    return this.viewForm.controls.controls as ViewControlsForm;
  }

  public get gesturesForm() {
    return this.viewForm.controls.gestures as ViewGesturesForm;
  }

  public get resultForm() {
    return this.settingsForm.controls.result as ResultForm;
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
      {} as EnumDictionary<SettingsFieldName, FormControl>
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
