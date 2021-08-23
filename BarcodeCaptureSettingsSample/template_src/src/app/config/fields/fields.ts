
import { SettingsFieldType } from './fields-type';
import { SettingsFieldName } from './fields-name';
import {
  BrushColor,
  ViewfinderType,
  ViewfinderColor,
  ViewfinderStyle,
  ViewfinderLineStyle,
  LaserlineViewfinderStyle,
  SizeSpecification,
  LocationSelectionType,
} from 'src/app/models/sdk.model';
import { EnumDictionary } from 'src/app/models/utils.model';
import {
  DEFAULT_UNIT_NUMBER_VALUE,
  UnitNumber,
  DEFAULT_UNIT_NUMBER_VALUE_FRACTION,
  DEFAULT_UNIT_NUMBER_VALUE_FRACTION_HALF,
} from 'src/app/models/unit-number.model';
import { NavigationRoute } from '../routes.config';

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

  // barcode capture
  // barcode capture - location selection
  [SettingsFieldName.LOCATION_SELECTION_TYPE]: {
    label: 'Type',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.LOCATION_SELECTION_TYPE,
    defaultValue: LocationSelectionType.None,
    options: [
      { label: 'None', value: LocationSelectionType.None },
      { label: 'Radius', value: LocationSelectionType.Radius },
      { label: 'Rectangular', value: LocationSelectionType.Rectangular },
    ],
  } as SettingsField<LocationSelectionType>,
  [SettingsFieldName.LOCATION_SELECTION_SIZE_SPECIFICATION]: {
    label: 'Type',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.LOCATION_SELECTION_SIZE_SPECIFICATION,
    defaultValue: SizeSpecification.WidthAndHeight,
    options: [
      { label: 'Width and Height', value: SizeSpecification.WidthAndHeight },
      { label: 'Width and Height Aspect', value: SizeSpecification.WidthAndHeightAspect },
      { label: 'Height and Width Aspect', value: SizeSpecification.HeightAndWidthAspect },
    ],
  } as SettingsField<SizeSpecification>,
  [SettingsFieldName.LOCATION_SELECTION_WIDTH_ASPECT]: {
    label: 'Width Aspect',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.LOCATION_SELECTION_WIDTH_ASPECT,
    defaultValue: 0,
  } as SettingsField<number>,
  [SettingsFieldName.LOCATION_SELECTION_HEIGHT_ASPECT]: {
    label: 'Height Aspect',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.LOCATION_SELECTION_HEIGHT_ASPECT,
    defaultValue: 0,
  } as SettingsField<number>,
  [SettingsFieldName.LOCATION_SELECTION_WIDTH]: {
    label: 'Width',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.LOCATION_SELECTION_WIDTH,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE(Scandit),
    path: NavigationRoute.LOCATION_SELECTION_WIDTH,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.LOCATION_SELECTION_HEIGHT]: {
    label: 'Height',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.LOCATION_SELECTION_HEIGHT,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE(Scandit),
    path: NavigationRoute.LOCATION_SELECTION_HEIGHT,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.LOCATION_SELECTION_SIZE]: {
    label: 'Size',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.LOCATION_SELECTION_SIZE,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE(Scandit),
    path: NavigationRoute.LOCATION_SELECTION_SIZE,
  } as SettingsField<UnitNumber>,

  // barcode capture - feedback
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

  // barcode capture - code duplicate filter
  [SettingsFieldName.CODE_DUPLICATE_FILTER]: {
    label: 'Code Duplicate Filter (s)',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.CODE_DUPLICATE_FILTER,
    defaultValue: 0,
  } as SettingsField<number>,

  // barcode capture - composite types
  [SettingsFieldName.COMPOSITE_TYPES]: {
    label: 'Composite Types',
    type: SettingsFieldType.MULTI_SELECT,
    key: SettingsFieldName.COMPOSITE_TYPES,
    defaultValue: [],
    options: [
      { label: 'A', value: Scandit.CompositeType.A },
      { label: 'B', value: Scandit.CompositeType.B },
      { label: 'C', value: Scandit.CompositeType.C },
    ],
  } as SettingsField<any>,

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
  [SettingsFieldName.MAX_FRAME_RATE]: {
    label: 'Max Frame Rate',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.MAX_FRAME_RATE,
    defaultValue: 30,
  } as SettingsField<number>,
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
  [SettingsFieldName.ZOOM_GESTURE_ZOOM_FACTOR]: {
    label: 'Zoom Gesture Zoom Factor',
    type: SettingsFieldType.SLIDER,
    key: SettingsFieldName.ZOOM_GESTURE_ZOOM_FACTOR,
    defaultValue: 2,
    min: 1,
    max: 20,
  } as SettingsField<number>,
  [SettingsFieldName.FOCUS_RANGE]: {
    label: 'Focus Range',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.FOCUS_RANGE,
    defaultValue: Scandit.FocusRange.Near,
    options: [
      { label: 'Full', value: Scandit.FocusRange.Full },
      { label: 'Far', value: Scandit.FocusRange.Far },
      { label: 'Near', value: Scandit.FocusRange.Near },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.FOCUS_GESTURE_STRATEGY]: {
    label: 'Focus Gesture Strategy',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.FOCUS_GESTURE_STRATEGY,
    defaultValue: Scandit.FocusGestureStrategy.ManualUntilCapture,
    options: [
      { label: 'None', value: Scandit.FocusGestureStrategy.None },
      { label: 'Manual', value: Scandit.FocusGestureStrategy.Manual },
      { label: 'Manual until capture', value: Scandit.FocusGestureStrategy.ManualUntilCapture },
    ],
  } as SettingsField<string>,

  // view
  // view - scan area
  [SettingsFieldName.SCAN_AREA_MARGIN_TOP]: {
    label: 'Top',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_TOP,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE(Scandit),
    path: NavigationRoute.SCAN_AREA_MARGIN_TOP,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.SCAN_AREA_MARGIN_RIGHT]: {
    label: 'Right',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_RIGHT,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE(Scandit),
    path: NavigationRoute.SCAN_AREA_MARGIN_RIGHT,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.SCAN_AREA_MARGIN_BOTTOM]: {
    label: 'Bottom',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_BOTTOM,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE(Scandit),
    path: NavigationRoute.SCAN_AREA_MARGIN_BOTTOM,
    min: 0,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.SCAN_AREA_MARGIN_LEFT]: {
    label: 'Left',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.SCAN_AREA_MARGIN_LEFT,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE(Scandit),
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
  [SettingsFieldName.BRUSH]: {
    label: 'Brush',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.BRUSH,
    defaultValue: BrushColor.Default,
    options: [
      { label: 'Default', value: BrushColor.Default },
      { label: 'Red', value: BrushColor.Red },
      { label: 'Green', value: BrushColor.Green },
    ],
  } as SettingsField<string>,

  // view - viewfinder
  [SettingsFieldName.VIEWFINDER_TYPE]: {
    label: 'Type',
    type: SettingsFieldType.FLAT_SELECT,
    key: SettingsFieldName.VIEWFINDER_TYPE,
    defaultValue: ViewfinderType.None,
    options: [
      { label: 'None', value: ViewfinderType.None },
      { label: 'Rectangular', value: ViewfinderType.Rectangular },
      { label: 'Laserline', value: ViewfinderType.Laserline },
      { label: 'Aimer', value: ViewfinderType.Aimer },
    ],
  } as SettingsField<ViewfinderType>,
  [SettingsFieldName.VIEWFINDER_SIZE_SPECIFICATION]: {
    label: 'Type',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_SIZE_SPECIFICATION,
    defaultValue: SizeSpecification.WidthAndHeight,
    options: [
      { label: 'Width and Height', value: SizeSpecification.WidthAndHeight },
      { label: 'Width and Height Aspect', value: SizeSpecification.WidthAndHeightAspect },
      { label: 'Height and Width Aspect', value: SizeSpecification.HeightAndWidthAspect },
      { label: 'Shorter Dimension and Aspect Ratio', value: SizeSpecification.ShorterDimensionAndAspectRation },
    ],
  } as SettingsField<SizeSpecification>,

  [SettingsFieldName.VIEWFINDER_STYLE]: {
    label: 'Style',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_STYLE,
    defaultValue: ViewfinderStyle.Legacy,
    options: [
      { label: 'Legacy', value: ViewfinderStyle.Legacy },
      { label: 'Square', value: ViewfinderStyle.Square },
      { label: 'Rounded', value: ViewfinderStyle.Rounded },
    ],
  } as SettingsField<ViewfinderStyle>,
  [SettingsFieldName.VIEWFINDER_LINE_STYLE]: {
    label: 'Line Style',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_LINE_STYLE,
    defaultValue: ViewfinderLineStyle.Light,
    options: [
      { label: 'Light', value: ViewfinderLineStyle.Light },
      { label: 'Bold', value: ViewfinderLineStyle.Bold },
    ],
  } as SettingsField<ViewfinderLineStyle>,
  [SettingsFieldName.VIEWFINDER_DIMMING]: {
    label: 'Dimming',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.VIEWFINDER_DIMMING,
    defaultValue: 0,
  } as SettingsField<number>,
  [SettingsFieldName.VIEWFINDER_ANIMATED]: {
    label: 'Animated',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.VIEWFINDER_ANIMATED,
    defaultValue: true,
  } as SettingsField<boolean>,
  [SettingsFieldName.VIEWFINDER_LOOPING]: {
    label: 'Looping',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.VIEWFINDER_LOOPING,
    defaultValue: true,
  } as SettingsField<boolean>,
  [SettingsFieldName.VIEWFINDER_COLOR]: {
    label: 'Color',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_COLOR,
    defaultValue: ViewfinderColor.White,
    options: [
      { label: 'Default', value: ViewfinderColor.White },
      { label: 'Blue', value: ViewfinderColor.Blue },
      { label: 'Black', value: ViewfinderColor.Black },
    ],
  } as SettingsField<ViewfinderColor>,
  [SettingsFieldName.VIEWFINDER_ENABLED_COLOR]: {
    label: 'Enabled Color',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_ENABLED_COLOR,
    defaultValue: ViewfinderColor.White,
    options: [
      { label: 'Default', value: ViewfinderColor.White },
      { label: 'Red', value: ViewfinderColor.Red },
      { label: 'White', value: ViewfinderColor.White },
    ],
  } as SettingsField<ViewfinderColor>,
  [SettingsFieldName.VIEWFINDER_DISABLED_COLOR]: {
    label: 'Disabled Color',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_DISABLED_COLOR,
    defaultValue: ViewfinderColor.White,
    options: [
      { label: 'Default', value: ViewfinderColor.White },
      { label: 'Blue', value: ViewfinderColor.Blue },
      { label: 'Red', value: ViewfinderColor.Red },
    ],
  } as SettingsField<ViewfinderColor>,
  [SettingsFieldName.VIEWFINDER_AIMER_FRAME_COLOR]: {
    label: 'Frame Color',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_AIMER_FRAME_COLOR,
    defaultValue: ViewfinderColor.White,
    options: [
      { label: 'Default', value: ViewfinderColor.White },
      { label: 'Blue', value: ViewfinderColor.Blue },
      { label: 'Red', value: ViewfinderColor.Red },
    ],
  } as SettingsField<ViewfinderColor>,
  [SettingsFieldName.VIEWFINDER_AIMER_DOT_COLOR]: {
    label: 'Dot Color',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_AIMER_DOT_COLOR,
    defaultValue: ViewfinderColor.White,
    options: [
      { label: 'Default', value: ViewfinderColor.White },
      { label: 'Blue', value: ViewfinderColor.Blue },
      { label: 'Red', value: ViewfinderColor.Red },
    ],
  } as SettingsField<ViewfinderColor>,
  [SettingsFieldName.VIEWFINDER_WIDTH_ASPECT]: {
    label: 'Width Aspect',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.VIEWFINDER_WIDTH_ASPECT,
    defaultValue: 0,
  } as SettingsField<number>,
  [SettingsFieldName.VIEWFINDER_SHORTER_DIM]: {
    label: 'Shorter Dimension',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.VIEWFINDER_SHORTER_DIM,
    defaultValue: 0,
  } as SettingsField<number>,
  [SettingsFieldName.VIEWFINDER_ASPECT_RATIO]: {
    label: 'Aspect Ratio',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.VIEWFINDER_ASPECT_RATIO,
    defaultValue: 1,
  } as SettingsField<number>,
  [SettingsFieldName.VIEWFINDER_HEIGHT_ASPECT]: {
    label: 'Height Aspect',
    type: SettingsFieldType.NUMBER,
    key: SettingsFieldName.VIEWFINDER_HEIGHT_ASPECT,
    defaultValue: 0,
  } as SettingsField<number>,
  [SettingsFieldName.VIEWFINDER_WIDTH]: {
    label: 'Width',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.VIEWFINDER_WIDTH,
    defaultValue: { unit: Scandit.MeasureUnit.Fraction, value: 0.8 },
    path: NavigationRoute.VIEWFINDER_WIDTH,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.VIEWFINDER_HEIGHT]: {
    label: 'Height',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.VIEWFINDER_HEIGHT,
    defaultValue: { unit: Scandit.MeasureUnit.Fraction, value: 0.32 },
    path: NavigationRoute.VIEWFINDER_HEIGHT,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.VIEWFINDER_LASERLINE_WIDTH]: {
    label: 'Width',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.VIEWFINDER_LASERLINE_WIDTH,
    defaultValue: { unit: Scandit.MeasureUnit.Fraction, value: 0.75 },
    path: NavigationRoute.VIEWFINDER_LASERLINE_WIDTH,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.VIEWFINDER_LASERLINE_STYLE]: {
    label: 'Style',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.VIEWFINDER_LASERLINE_STYLE,
    defaultValue: LaserlineViewfinderStyle.Legacy,
    options: [
      { label: 'Legacy', value: LaserlineViewfinderStyle.Legacy },
      { label: 'Animated', value: LaserlineViewfinderStyle.Animated },
    ],
  } as SettingsField<string>,

  // view - logo
  [SettingsFieldName.LOGO_ANCHOR]: {
    label: 'Anchor',
    type: SettingsFieldType.SELECT,
    key: SettingsFieldName.LOGO_ANCHOR,
    defaultValue: Scandit.Anchor.BottomRight,
    options: [
      { label: 'Top Left', value: Scandit.Anchor.TopLeft },
      { label: 'Top Center', value: Scandit.Anchor.TopCenter },
      { label: 'Top Right', value: Scandit.Anchor.TopRight },
      { label: 'Center Left', value: Scandit.Anchor.CenterLeft },
      { label: 'Center', value: Scandit.Anchor.Center },
      { label: 'Center Right', value: Scandit.Anchor.CenterRight },
      { label: 'Bottom Left', value: Scandit.Anchor.BottomLeft },
      { label: 'Bottom Center', value: Scandit.Anchor.BottomCenter },
      { label: 'Bottom Right', value: Scandit.Anchor.BottomRight },
    ],
  } as SettingsField<string>,
  [SettingsFieldName.LOGO_X]: {
    label: 'X',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.LOGO_X,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION(Scandit),
    path: NavigationRoute.LOGO_X,
  } as SettingsField<UnitNumber>,
  [SettingsFieldName.LOGO_Y]: {
    label: 'Y',
    type: SettingsFieldType.UNIT_NUMBER,
    key: SettingsFieldName.LOGO_Y,
    defaultValue: DEFAULT_UNIT_NUMBER_VALUE_FRACTION(Scandit),
    path: NavigationRoute.LOGO_Y,
  } as SettingsField<UnitNumber>,

  // view - controls
  [SettingsFieldName.TORCH_BUTTON]: {
    label: 'Torch Button',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.TORCH_BUTTON,
    defaultValue: false,
  } as SettingsField<boolean>,

  // view - gestures
  [SettingsFieldName.TAP_TO_FOCUS]: {
    label: 'Tap to Focus',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.TAP_TO_FOCUS,
    defaultValue: true,
  } as SettingsField<boolean>,
  [SettingsFieldName.SWIPE_TO_ZOOM]: {
    label: 'Swipe to Zoom',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.SWIPE_TO_ZOOM,
    defaultValue: true,
  } as SettingsField<boolean>,

  // result
  [SettingsFieldName.CONTINUOUS_SCANNING]: {
    label: 'Continuous Scanning',
    type: SettingsFieldType.TOGGLE,
    key: SettingsFieldName.CONTINUOUS_SCANNING,
    defaultValue: false,
  } as SettingsField<boolean>,
});
