import { SettingsFieldName } from './fields-name';

export const fieldsStructure = Scandit => ({
  barcodeCapture: {
    symbologies: [
      ...Object.keys(Scandit.Symbology),
    ],
    locationSelection: [
      SettingsFieldName.LOCATION_SELECTION_TYPE,
      SettingsFieldName.LOCATION_SELECTION_SIZE_SPECIFICATION,
      SettingsFieldName.LOCATION_SELECTION_WIDTH,
      SettingsFieldName.LOCATION_SELECTION_WIDTH_ASPECT,
      SettingsFieldName.LOCATION_SELECTION_HEIGHT,
      SettingsFieldName.LOCATION_SELECTION_HEIGHT_ASPECT,
      SettingsFieldName.LOCATION_SELECTION_SIZE,
    ],
    feedback: [
      SettingsFieldName.FEEDBACK_SOUND,
      SettingsFieldName.FEEDBACK_VIBRATION,
    ],
    codeDuplicateFilter: [
        SettingsFieldName.CODE_DUPLICATE_FILTER
    ],
    compositeTypes: [
        SettingsFieldName.COMPOSITE_TYPES
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
      SettingsFieldName.BRUSH,
    ],
    viewfinder: [
      SettingsFieldName.VIEWFINDER_TYPE,
      SettingsFieldName.VIEWFINDER_SIZE_SPECIFICATION,
      SettingsFieldName.VIEWFINDER_WIDTH,
      SettingsFieldName.VIEWFINDER_WIDTH_ASPECT,
      SettingsFieldName.VIEWFINDER_SHORTER_DIM,
      SettingsFieldName.VIEWFINDER_ASPECT_RATIO,
      SettingsFieldName.VIEWFINDER_HEIGHT,
      SettingsFieldName.VIEWFINDER_HEIGHT_ASPECT,
      SettingsFieldName.VIEWFINDER_LASERLINE_WIDTH,
      SettingsFieldName.VIEWFINDER_LASERLINE_STYLE,
      SettingsFieldName.VIEWFINDER_STYLE,
      SettingsFieldName.VIEWFINDER_LINE_STYLE,
      SettingsFieldName.VIEWFINDER_DIMMING,
      SettingsFieldName.VIEWFINDER_ANIMATED,
      SettingsFieldName.VIEWFINDER_LOOPING,
      SettingsFieldName.VIEWFINDER_COLOR,
      SettingsFieldName.VIEWFINDER_ENABLED_COLOR,
      SettingsFieldName.VIEWFINDER_DISABLED_COLOR,
      SettingsFieldName.VIEWFINDER_AIMER_FRAME_COLOR,
      SettingsFieldName.VIEWFINDER_AIMER_DOT_COLOR,
    ],
    logo: [
      SettingsFieldName.LOGO_ANCHOR,
      SettingsFieldName.LOGO_X,
      SettingsFieldName.LOGO_Y,
    ],
    controls: [
      SettingsFieldName.TORCH_BUTTON,
      SettingsFieldName.ZOOM_BUTTON,
    ],
    gestures: [
      SettingsFieldName.TAP_TO_FOCUS,
      SettingsFieldName.SWIPE_TO_ZOOM,
    ],
  },
  camera: [
    SettingsFieldName.CAMERA_POSITION,
    SettingsFieldName.DESIRED_TORCH_STATE,
    SettingsFieldName.MAX_FRAME_RATE,
    SettingsFieldName.PREFERRED_RESOLUTION,
    SettingsFieldName.ZOOM_FACTOR,
    SettingsFieldName.ZOOM_GESTURE_ZOOM_FACTOR,
    SettingsFieldName.FOCUS_RANGE,
    SettingsFieldName.FOCUS_GESTURE_STRATEGY,
  ],
  result: [
    SettingsFieldName.CONTINUOUS_SCANNING
  ],
});
