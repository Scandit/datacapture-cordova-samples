import { SettingsFieldName } from '../../config';
import { BarcodeSelectionBasicOverlayStyle, Brush, Color } from '../sdk.model';
import { UnitNumber } from '../unit-number.model';
import { TypedFormGroup } from '../utils.model';

export interface ViewScanAreaFormValue {
  [SettingsFieldName.SCAN_AREA_MARGIN_TOP]: UnitNumber;
  [SettingsFieldName.SCAN_AREA_MARGIN_RIGHT]: UnitNumber;
  [SettingsFieldName.SCAN_AREA_MARGIN_BOTTOM]: UnitNumber;
  [SettingsFieldName.SCAN_AREA_MARGIN_LEFT]: UnitNumber;
  [SettingsFieldName.SCAN_AREA_GUIDES]: boolean;
}

export interface ViewPointOfInterestFormValue {
  [SettingsFieldName.POINT_OF_INTEREST_X]: UnitNumber;
  [SettingsFieldName.POINT_OF_INTEREST_Y]: UnitNumber;
}

export interface ViewOverlayFormValue {
  [SettingsFieldName.OVERLAY_STYLE]: BarcodeSelectionBasicOverlayStyle;
  [SettingsFieldName.TRACKED_BRUSH]: Brush;
  [SettingsFieldName.AIMED_BRUSH]: Brush;
  [SettingsFieldName.SELECTING_BRUSH]: Brush;
  [SettingsFieldName.SELECTED_BRUSH]: Brush;
  [SettingsFieldName.SHOULD_SHOW_HINTS]: boolean;
}

export interface ViewViewfinderFormValue {
  [SettingsFieldName.FRAME_COLOR]: Color;
  [SettingsFieldName.DOT_COLOR]: Color;
}

export interface ViewFormValue {
  scanArea?: ViewScanAreaFormValue;
  pointOfInterest?: ViewPointOfInterestFormValue;
  overlay?: ViewOverlayFormValue;
  viewfinder?: ViewViewfinderFormValue;
}

export type ViewScanAreaForm = TypedFormGroup<ViewScanAreaFormValue>;
export type ViewPointOfInterestForm = TypedFormGroup<ViewPointOfInterestFormValue>;
export type ViewOverlayForm = TypedFormGroup<ViewOverlayFormValue>;
export type ViewViewfinderForm = TypedFormGroup<ViewViewfinderFormValue>;
export type ViewForm = TypedFormGroup<ViewFormValue>;
