import {
  BarcodeSelectionFreezeBehavior,
  BarcodeSelectionStrategyType,
  BarcodeSelectionTapBehavior,
  BarcodeSelectionTypeName,
} from '..';
import { SettingsFieldName } from '../../config';
import { UnitNumber } from '../unit-number.model';
import { TypedFormGroup } from '../utils.model';

export interface BarcodeSelectionSymbologyFormValue {
  enabled: boolean;
  colorInverted: boolean;
  minimum: number;
  maximum: number;
  extensions: string[];
}

export interface BarcodeSelectionSymbologiesFormValue {
  [symbology: string]: BarcodeSelectionSymbologyFormValue;
}

export interface BarcodeSelectionSelectionTypeFormValue {
  [SettingsFieldName.SELECTION_TYPE]: BarcodeSelectionTypeName;
  [SettingsFieldName.FREEZE_BEHAVIOUR]: BarcodeSelectionFreezeBehavior;
  [SettingsFieldName.TAP_BEHAVIOUR]: BarcodeSelectionTapBehavior;
  [SettingsFieldName.SELECTION_STRATEGY]: BarcodeSelectionStrategyType;
}

export interface BarcodeSelectionFeedbackFormValue {
  [SettingsFieldName.FEEDBACK_SOUND]?: boolean;
  [SettingsFieldName.FEEDBACK_VIBRATION]?: boolean;
}

export interface BarcodeSelectionCodeDuplicateFilterFormValue {
  [SettingsFieldName.CODE_DUPLICATE_FILTER]?: number;
}

export interface BarcodeSelectionSingleBarcodeAutoDetectionFormValue {
  [SettingsFieldName.SINGLE_BARCODE_AUTO_DETECTION]?: boolean;
}

export interface BarcodeSelectionPointOfInterestFormValue {
  [SettingsFieldName.BS_POINT_OF_INTEREST_ENABLED]: boolean;
  [SettingsFieldName.BS_POINT_OF_INTEREST_X]: UnitNumber;
  [SettingsFieldName.BS_POINT_OF_INTEREST_Y]: UnitNumber;
}

export interface BarcodeSelectionFormValue {
  selectionType?: BarcodeSelectionSelectionTypeFormValue;
  symbologies?: BarcodeSelectionSelectionTypeFormValue;
  pointOfInterest?: BarcodeSelectionPointOfInterestFormValue;
  feedback?: BarcodeSelectionFeedbackFormValue;
  codeDuplicateFilter?: BarcodeSelectionCodeDuplicateFilterFormValue;
  singleBarcodeAutoDetection?: BarcodeSelectionSingleBarcodeAutoDetectionFormValue;
}

export type BarcodeSelectionForm = TypedFormGroup<BarcodeSelectionFormValue>;
export type BarcodeSelectionSymbologyForm = TypedFormGroup<BarcodeSelectionSymbologyFormValue>;
export type BarcodeSelectionSymbologiesForm = TypedFormGroup<BarcodeSelectionSymbologiesFormValue>;
export type BarcodeSelectionPointOfInterestForm = TypedFormGroup<BarcodeSelectionPointOfInterestFormValue>;
export type BarcodeSelectionSelectionTypeForm = TypedFormGroup<BarcodeSelectionSelectionTypeFormValue>;
export type BarcodeSelectionFeedbackForm = TypedFormGroup<BarcodeSelectionFeedbackFormValue>;
export type BarcodeSelectionCodeDuplicateFilterForm = TypedFormGroup<BarcodeSelectionCodeDuplicateFilterFormValue>;
export type BarcodeSelectionSingleBarcodeAutoDetectionForm = TypedFormGroup<BarcodeSelectionSingleBarcodeAutoDetectionFormValue>;
