import { SettingsFieldName } from '../../config';
import { TypedFormGroup } from '../utils.model';

import { BarcodeCaptureFormValue } from './barcode-capture-form.model';
import { CameraFormValue } from './camera-form.model';
import { ViewFormValue } from './view-form.model';
import { ResultFormValue } from './result-form.model';


export interface SettingsFormValue {
  barcodeCapture?: BarcodeCaptureFormValue;
  camera?: CameraFormValue;
  view?: ViewFormValue;
  result?: ResultFormValue;
}

export type SettingsForm = TypedFormGroup<SettingsFormValue>;
