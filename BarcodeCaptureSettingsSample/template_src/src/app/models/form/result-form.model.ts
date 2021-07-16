import { SettingsFieldName } from '../../config';
import { TypedFormGroup } from '../utils.model';

export interface ResultFormValue {
  [SettingsFieldName.CONTINUOUS_SCANNING]?: boolean;
}

export type ResultForm = TypedFormGroup<ResultFormValue>;
