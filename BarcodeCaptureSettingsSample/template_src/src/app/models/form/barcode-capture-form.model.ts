import { SettingsFieldName } from '../../config';
import { TypedFormGroup } from '../utils.model';
import { UnitNumber } from '../unit-number.model';
import { LocationSelectionType, SizeSpecification } from '../sdk.model';

export interface BarcodeCaptureSymbologyFormValue {
  enabled: boolean;
  colorInverted: boolean;
  minimum: number;
  maximum: number;
  extensions: string[];
}

export interface BarcodeCaptureSymbologiesFormValue {
  [symbology: string]: BarcodeCaptureSymbologyFormValue;
}

export interface BarcodeCaptureLocationSelectionFormValue {
  [SettingsFieldName.LOCATION_SELECTION_TYPE]: LocationSelectionType;
  [SettingsFieldName.LOCATION_SELECTION_SIZE_SPECIFICATION]: SizeSpecification;
  [SettingsFieldName.LOCATION_SELECTION_WIDTH]: UnitNumber;
  [SettingsFieldName.LOCATION_SELECTION_WIDTH_ASPECT]: number;
  [SettingsFieldName.LOCATION_SELECTION_HEIGHT]: UnitNumber;
  [SettingsFieldName.LOCATION_SELECTION_HEIGHT_ASPECT]: number;
  [SettingsFieldName.LOCATION_SELECTION_SIZE]: UnitNumber;
}

export interface BarcodeCaptureFeedbackFormValue {
  [SettingsFieldName.FEEDBACK_SOUND]?: boolean;
  [SettingsFieldName.FEEDBACK_VIBRATION]?: boolean;
}

export interface BarcodeCaptureCodeDuplicateFilterFormValue {
  [SettingsFieldName.CODE_DUPLICATE_FILTER]?: number;
}

export interface BarcodeCaptureCompositeTypesFormValue {
  [SettingsFieldName.COMPOSITE_TYPES]?: string;
}

export interface BarcodeCaptureFormValue {
  locationSelection?: BarcodeCaptureLocationSelectionFormValue;
  symbologies?: BarcodeCaptureLocationSelectionFormValue;
  feedback?: BarcodeCaptureFeedbackFormValue;
  codeDuplicateFilter?: BarcodeCaptureCodeDuplicateFilterFormValue;
  compositeTypes?: BarcodeCaptureCompositeTypesFormValue;
}

export type BarcodeCaptureForm = TypedFormGroup<BarcodeCaptureFormValue>;
export type BarcodeCaptureSymbologyForm = TypedFormGroup<BarcodeCaptureSymbologyFormValue>;
export type BarcodeCaptureSymbologiesForm = TypedFormGroup<BarcodeCaptureSymbologiesFormValue>;
export type BarcodeCaptureLocationSelectionForm = TypedFormGroup<BarcodeCaptureLocationSelectionFormValue>;
export type BarcodeCaptureFeedbackForm = TypedFormGroup<BarcodeCaptureFeedbackFormValue>;
export type BarcodeCaptureCodeDuplicateFilterForm = TypedFormGroup<BarcodeCaptureCodeDuplicateFilterFormValue>;
export type BarcodeCaptureCompositeTypesForm = TypedFormGroup<BarcodeCaptureCompositeTypesFormValue>;
