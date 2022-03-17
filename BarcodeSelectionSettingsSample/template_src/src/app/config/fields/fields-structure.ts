import { SettingsFieldName } from './fields-name';

export const fieldsStructure = Scandit => ({
  barcodeSelection: {
    symbologies: [
      ...Object.keys(Scandit.Symbology),
    ],
    selectionType: [
      SettingsFieldName.SELECTION_TYPE,
      SettingsFieldName.FREEZE_BEHAVIOUR,
      SettingsFieldName.TAP_BEHAVIOUR,
      SettingsFieldName.SELECTION_STRATEGY,
    ],
    singleBarcodeAutoDetection: [
      SettingsFieldName.SINGLE_BARCODE_AUTO_DETECTION
    ],
    feedback: [
      SettingsFieldName.FEEDBACK_SOUND,
      SettingsFieldName.FEEDBACK_VIBRATION,
    ],
    codeDuplicateFilter: [
        SettingsFieldName.CODE_DUPLICATE_FILTER
    ],
    pointOfInterest: [
      SettingsFieldName.BS_POINT_OF_INTEREST_ENABLED,
      SettingsFieldName.BS_POINT_OF_INTEREST_X,
      SettingsFieldName.BS_POINT_OF_INTEREST_Y,
    ],
  },
  view: {
    scanArea: [
      SettingsFieldName.SCAN_AREA_MARGIN_TOP,
      SettingsFieldName.SCAN_AREA_MARGIN_RIGHT,
      SettingsFieldName.SCAN_AREA_MARGIN_BOTTOM,
      SettingsFieldName.SCAN_AREA_MARGIN_LEFT,
      SettingsFieldName.SCAN_AREA_GUIDES,
    ],
    pointOfInterest: [
      SettingsFieldName.POINT_OF_INTEREST_X,
      SettingsFieldName.POINT_OF_INTEREST_Y,
    ],
    overlay: [
      SettingsFieldName.OVERLAY_STYLE,
      SettingsFieldName.TRACKED_BRUSH,
      SettingsFieldName.AIMED_BRUSH,
      SettingsFieldName.SELECTING_BRUSH,
      SettingsFieldName.SELECTED_BRUSH,
      SettingsFieldName.SHOULD_SHOW_HINTS,
    ],
    viewfinder: [
      SettingsFieldName.FRAME_COLOR,
      SettingsFieldName.DOT_COLOR,
    ],
  },
  camera: [
    SettingsFieldName.CAMERA_POSITION,
    SettingsFieldName.DESIRED_TORCH_STATE,
    SettingsFieldName.PREFERRED_RESOLUTION,
    SettingsFieldName.ZOOM_FACTOR,
    SettingsFieldName.FOCUS_RANGE,
  ],
});
