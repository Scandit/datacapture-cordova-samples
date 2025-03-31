import { TypedFormGroup } from '../utils.model';
import { BarcodeSelectionFormValue } from './barcode-selection-form.model';
import { CameraFormValue } from './camera-form.model';
import { ViewFormValue } from './view-form.model';


export interface SettingsFormValue {
  barcodeSelection?: BarcodeSelectionFormValue;
  camera?: CameraFormValue;
  view?: ViewFormValue;
  reset?: boolean;
}

export type SettingsForm = TypedFormGroup<SettingsFormValue>;
