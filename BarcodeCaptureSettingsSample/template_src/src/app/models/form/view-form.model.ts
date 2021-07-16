import { SettingsFieldName } from '../../config';
import { TypedFormGroup } from '../utils.model';
import { UnitNumber } from '../unit-number.model';
import { BrushColor, ViewfinderColor, ViewfinderType, SizeSpecification } from '../sdk.model';

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
  [SettingsFieldName.BRUSH]: BrushColor;
}

export interface ViewViewfinderFormValue {
  [SettingsFieldName.VIEWFINDER_TYPE]: ViewfinderType;
  [SettingsFieldName.VIEWFINDER_SIZE_SPECIFICATION]: SizeSpecification;
  [SettingsFieldName.VIEWFINDER_WIDTH]: UnitNumber;
  [SettingsFieldName.VIEWFINDER_WIDTH_ASPECT]: number;
  [SettingsFieldName.VIEWFINDER_SHORTER_DIM]: number;
  [SettingsFieldName.VIEWFINDER_ASPECT_RATIO]: number;
  [SettingsFieldName.VIEWFINDER_HEIGHT]: UnitNumber;
  [SettingsFieldName.VIEWFINDER_HEIGHT_ASPECT]: number;
  [SettingsFieldName.VIEWFINDER_STYLE]: string;
  [SettingsFieldName.VIEWFINDER_LINE_STYLE]: string;
  [SettingsFieldName.VIEWFINDER_DIMMING]: string;
  [SettingsFieldName.VIEWFINDER_COLOR]: ViewfinderColor;
  [SettingsFieldName.VIEWFINDER_LASERLINE_WIDTH]: UnitNumber;
  [SettingsFieldName.VIEWFINDER_LASERLINE_STYLE]: string;
  [SettingsFieldName.VIEWFINDER_ENABLED_COLOR]: ViewfinderColor;
  [SettingsFieldName.VIEWFINDER_DISABLED_COLOR]: ViewfinderColor;
  [SettingsFieldName.VIEWFINDER_AIMER_FRAME_COLOR]: ViewfinderColor;
  [SettingsFieldName.VIEWFINDER_AIMER_DOT_COLOR]: ViewfinderColor;
}

export interface ViewLogoFormValue {
  [SettingsFieldName.LOGO_ANCHOR]: string; // Anchor;
  [SettingsFieldName.LOGO_X]: UnitNumber;
  [SettingsFieldName.LOGO_Y]: UnitNumber;
}

export interface ViewControlsFormValue {
  [SettingsFieldName.TORCH_BUTTON]: boolean;
}

export interface ViewGesturesFormValue {
  [SettingsFieldName.TAP_TO_FOCUS]: boolean;
  [SettingsFieldName.SWIPE_TO_ZOOM]: boolean;
}

export interface ViewFormValue {
  scanArea?: ViewScanAreaFormValue;
  pointOfInterest?: ViewPointOfInterestFormValue;
  overlay?: ViewOverlayFormValue;
  viewfinder?: ViewViewfinderFormValue;
  logo?: ViewLogoFormValue;
  controls?: ViewControlsFormValue;
  gestures?: ViewGesturesFormValue;
}

export type ViewScanAreaForm = TypedFormGroup<ViewScanAreaFormValue>;
export type ViewPointOfInterestForm = TypedFormGroup<ViewPointOfInterestFormValue>;
export type ViewOverlayForm = TypedFormGroup<ViewOverlayFormValue>;
export type ViewViewfinderForm = TypedFormGroup<ViewViewfinderFormValue>;
export type ViewLogoForm = TypedFormGroup<ViewLogoFormValue>;
export type ViewControlsForm = TypedFormGroup<ViewControlsFormValue>;
export type ViewGesturesForm = TypedFormGroup<ViewGesturesFormValue>;
export type ViewForm = TypedFormGroup<ViewFormValue>;
