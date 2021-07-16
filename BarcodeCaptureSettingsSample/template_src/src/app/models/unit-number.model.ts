export const DEFAULT_UNIT_NUMBER_VALUE = (Scandit): UnitNumber => ({
  value: 0,
  unit: Scandit.MeasureUnit.DIP,
});

export const DEFAULT_UNIT_NUMBER_VALUE_FRACTION = (Scandit): UnitNumber => ({
  value: 0,
  unit: Scandit.MeasureUnit.Fraction,
});

export const DEFAULT_UNIT_NUMBER_VALUE_FRACTION_HALF = (Scandit): UnitNumber => ({
  value: 0.5,
  unit: Scandit.MeasureUnit.Fraction,
});

export interface UnitNumber {
  value: number;
  unit: string; // MeasureUnit;
}
