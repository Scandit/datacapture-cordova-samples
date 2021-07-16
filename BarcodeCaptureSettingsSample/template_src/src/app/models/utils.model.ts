import { FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export type EnumDictionary<Enum extends string | symbol | number, Type> = {
  [Key in Enum]: Type;
};

export interface TypedFormGroup<Value> extends FormGroup {
  value: Value;
  getRawValue: () => Value;
  valueChanges: Observable<Value>;
  controls: EnumDictionary<keyof Value, AbstractControl>;
}
