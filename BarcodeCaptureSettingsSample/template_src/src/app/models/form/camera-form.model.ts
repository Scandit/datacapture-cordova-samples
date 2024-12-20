import { SettingsFieldName } from '../../config';
import { TypedFormGroup } from '../utils.model';

export interface CameraFormValue {
  [SettingsFieldName.CAMERA_POSITION]: string; // CameraPosition;
  [SettingsFieldName.DESIRED_TORCH_STATE]: boolean;
  [SettingsFieldName.PREFERRED_RESOLUTION]: string; // VideoResolution;
  [SettingsFieldName.ZOOM_FACTOR]: number;
  [SettingsFieldName.ZOOM_GESTURE_ZOOM_FACTOR]: number;
  [SettingsFieldName.FOCUS_RANGE]: string; // FocusRange;
  [SettingsFieldName.FOCUS_GESTURE_STRATEGY]: string; // FocusGestureStrategy;
}

export type CameraForm = TypedFormGroup<CameraFormValue>;
