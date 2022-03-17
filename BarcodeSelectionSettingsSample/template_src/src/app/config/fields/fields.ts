import {
  BarcodeSelectionBasicOverlayStyle,
  BarcodeSelectionFreezeBehavior,
  BarcodeSelectionStrategyType,
  BarcodeSelectionTapBehavior,
  BarcodeSelectionTypeName,
  Brush,
  Color,
} from 'src/app/models/sdk.model';
import {
  DEFAULT_UNIT_NUMBER_VALUE_FRACTION,
  DEFAULT_UNIT_NUMBER_VALUE_FRACTION_HALF,
  UnitNumber,
} from 'src/app/models/unit-number.model';
import { EnumDictionary } from 'src/app/models/utils.model';

import { NavigationRoute } from '../routes.config';
import { SettingsFieldName } from './fields-name';
import { SettingsFieldType } from './fields-type';


export interface SettingsFieldOption<T = string> {
  label: string;
  value: T;
}

export interface SettingsField<V = any> {
  label: string;
  type: SettingsFieldType;
  key: SettingsFieldName;
  defaultValue?: V;
  options?: SettingsFieldOption<V>[];
  min?: number;
  max?: number;
  path?: string;
}

export type SettingsFields = EnumDictionary<SettingsFieldName, SettingsField>;

export const settingsFields = (Scandit): SettingsFields => ({

  // barcode selection
  // barcode selection - selection type
  [SettingsFieldName.SELECTION_TYPE]: {
    label: 'Selection Type',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.SELECTION_TYPE,
    defaultValue: BarcodeSelectionTypeName.Tap,
    options: [
      { label: 'Tap to Select', value: BarcodeSelectionTypeName.Tap },
      { label: 'Aim to Select', value: BarcodeSelectionTypeName.Aimer },
    ],
  } as SettingsField<BarcodeSelectionTypeName>,
  [SettingsFieldName.FREEZE_BEHAVIOUR]: {
    label: 'Freeze Behaviour',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.FREEZE_BEHAVIOUR,
    defaultValue: BarcodeSelectionFreezeBehavior.Manual,
    options: [
      { label: 'Manual', value: BarcodeSelectionFreezeBehavior.Manual },
      { label: 'Manual and Automatic', value: BarcodeSelectionFreezeBehavior.ManualAndAutomatic },
    ],
  } as SettingsField<BarcodeSelectionFreezeBehavior>,
  [SettingsFieldName.TAP_BEHAVIOUR]: {
    label: 'Tap Behaviour',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.TAP_BEHAVIOUR,
    defaultValue: BarcodeSelectionTapBehavior.ToggleSelection,
    options: [
      { label: 'Toggle Selection', value: BarcodeSelectionTapBehavior.ToggleSelection },
      { label: 'Repeat Selection', value: BarcodeSelectionTapBehavior.RepeatSelection },
    ],
  } as SettingsField<BarcodeSelectionTapBehavior>,
  [SettingsFieldName.SELECTION_STRATEGY]: {
    label: 'Selection Strategy',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.SELECTION_STRATEGY,
    defaultValue: BarcodeSelectionStrategyType.Manual,
    options: [
      { label: 'Auto', value: BarcodeSelectionStrategyType.Auto },
      { label: 'Manual', value: BarcodeSelectionStrategyType.Manual },
    ],
  } as SettingsField<BarcodeSelectionStrategyType>,

  // barcode selection - feedback
  [SettingsFieldName.FEEDBACK_SOUND]: {
    label: 'Sound',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.FEEDBACK_SOUND,
    defaultValue: true,
  } as SettingsField<boolean>,
  [SettingsFieldName.FEEDBACK_VIBRATION]: {
    label: 'Vibration',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.FEEDBACK_VIBRATION,
    defaultValue: true,
  } as SettingsField<boolean>,

  // barcode selection - code duplicate filter
  [SettingsFieldName.CODE_DUPLICATE_FILTER]: {
    label: 'Code Duplicate Filter (s)',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.CODE_DUPLICATE_FILTER,
    defaultValue: 0.5,
  } as SettingsField<number>,

  // barcode selection - single barcode auto detection
  [SettingsFieldName.SINGLE_BARCODE_AUTO_DETECTION]: {
    label: 'Single Barcode Auto Detection',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.SINGLE_BARCODE_AUTO_DETECTION,
    defaultValue: false,
  } as SettingsField<boolean>,

  // barcode selection - point of interest
  [SettingsFieldName.BS_POINT_OF_INTEREST_ENABLED]: {
    label: 'Enabled',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.BS_POINT_OF_INTEREST_ENABLED,
    defaultValue: false,
  } as SettingsField<boolean>,
  [SettingsFieldName.BS_POINT_OF_INTEREST_X]: {
    label: 'X',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.BS_POINT_OF_INTEREST_X,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION_HALF(Scandit),
    path: NavigationRoute.BS_POINT_OF_INTEREST_X,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.BS_POINT_OF_INTEREST_Y]: {
    label: 'Y',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.BS_POINT_OF_INTEREST_Y,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION_HALF(Scandit),
    path: NavigationRoute.BS_POINT_OF_INTEREST_Y,
    min: 0,
  } as SettingsField<UnitNumber>,

  // camera
  [SettingsFieldName.CAMERA_POSITION]: {
    label: 'Camera Position',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.CAMERA_POSITION,
    defaultValue: Scandit.CameraPosition.WorldFacing,
    options: [
      { label: 'World Facing', value: Scandit.CameraPosition.WorldFacing },
      { label: 'User Facing', value: Scandit.CameraPosition.UserFacing },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.DESIRED_TORCH_STATE]: {
    label: 'Desired Torch State',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.DESIRED_TORCH_STATE,
    defaultValue: false,
  } as SettingsField<boolean>,
  [SettingsFieldName.PREFERRED_RESOLUTION]: {
    label: 'Preferred Resolution',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.PREFERRED_RESOLUTION,
    defaultValue: Scandit.VideoResolution.Auto,
    options: [
      { label: 'HD', value: Scandit.VideoResolution.HD },
      { label: 'Full HD', value: Scandit.VideoResolution.FullHD },
      { label: 'Auto', value: Scandit.VideoResolution.Auto },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.ZOOM_FACTOR]: {
    label: 'Zoom Factor',
    type: SettingsFieldType.SLIDER,
    key: SettingsFieldName.ZOOM_FACTOR,
    defaultValue: 1,
    min: 1,
    max: 20,
  } as SettingsField<number>,
  [SettingsFieldName.FOCUS_RANGE]: {
    label: 'Focus Range',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.FOCUS_RANGE,
    defaultValue: Scandit.FocusRange.Far,
    options: [
      { label: 'Full', value: Scandit.FocusRange.Full },
      { label: 'Far', value: Scandit.FocusRange.Far },
      { label: 'Near', value: Scandit.FocusRange.Near },
    ],
  } as SettingsField<string>,

  // view
  // view - scan area
  [SettingsFieldName.SCAN_AREA_MARGIN_TOP]: {
    label: 'Top',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_TOP,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION(Scandit),
    path: NavigationRoute.SCAN_AREA_MARGIN_TOP,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.SCAN_AREA_MARGIN_RIGHT]: {
    label: 'Right',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_RIGHT,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION(Scandit),
    path: NavigationRoute.SCAN_AREA_MARGIN_RIGHT,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.SCAN_AREA_MARGIN_BOTTOM]: {
    label: 'Bottom',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_BOTTOM,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION(Scandit),
    path: NavigationRoute.SCAN_AREA_MARGIN_BOTTOM,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.SCAN_AREA_MARGIN_LEFT]: {
    label: 'Left',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_LEFT,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION(Scandit),
    path: NavigationRoute.SCAN_AREA_MARGIN_LEFT,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.SCAN_AREA_GUIDES]: {
    label: 'Should Show Scan Area Guides',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.SCAN_AREA_GUIDES,
    defaultValue: false,
  } as SettingsField<boolean>,

  // view - point of interest
  [SettingsFieldName.POINT_OF_INTEREST_X]: {
    label: 'X',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.POINT_OF_INTEREST_X,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION_HALF(Scandit),
    path: NavigationRoute.POINT_OF_INTEREST_X,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.POINT_OF_INTEREST_Y]: {
    label: 'Y',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.POINT_OF_INTEREST_Y,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION_HALF(Scandit),
    path: NavigationRoute.POINT_OF_INTEREST_Y,
    min: 0,
  } as SettingsField<UnitNumber>,

  // view - overlay
  [SettingsFieldName.OVERLAY_STYLE]: {
    label: 'Overlay Style',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.OVERLAY_STYLE,
    defaultValue: BarcodeSelectionBasicOverlayStyle.Frame,
    options: [
      { label: 'Frame', value: BarcodeSelectionBasicOverlayStyle.Frame },
      { label: 'Dot', value: BarcodeSelectionBasicOverlayStyle.Dot },
    ],
  } as SettingsField<string>,

  [SettingsFieldName.TRACKED_BRUSH]: {
    label: 'Tracked Brush',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.TRACKED_BRUSH,
    defaultValue: Brush.Default,
    options: [
      { label: 'Default', value: Brush.Default },
      { label: 'Blue', value: Brush.Blue },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.AIMED_BRUSH]: {
    label: 'Aimed Brush',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.AIMED_BRUSH,
    defaultValue: Brush.Default,
    options: [
      { label: 'Default', value: Brush.Default },
      { label: 'Blue', value: Brush.Blue },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.SELECTING_BRUSH]: {
    label: 'Selecting Brush',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.SELECTING_BRUSH,
    defaultValue: Brush.Default,
    options: [
      { label: 'Default', value: Brush.Default },
      { label: 'Blue', value: Brush.Blue },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.SELECTED_BRUSH]: {
    label: 'Selected Brush',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.SELECTED_BRUSH,
    defaultValue: Brush.Default,
    options: [
      { label: 'Default', value: Brush.Default },
      { label: 'Blue', value: Brush.Blue },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.SHOULD_SHOW_HINTS]: {
    label: 'Should Show Hints',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.SHOULD_SHOW_HINTS,
    defaultValue: true,
  } as SettingsField<boolean>,

  // view - viewfinder
  [SettingsFieldName.FRAME_COLOR]: {
    label: 'Frame Color',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.FRAME_COLOR,
    defaultValue: Color.Default,
    options: [
      { label: 'Default', value: Color.Default },
      { label: 'Blue', value: Color.Blue },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.DOT_COLOR]: {
    label: 'Dot Color',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.DOT_COLOR,
    defaultValue: Color.Default,
    options: [
      { label: 'Default', value: Color.Default },
      { label: 'Blue', value: Color.Blue },
    ],
  } as SettingsField<string>,
});
