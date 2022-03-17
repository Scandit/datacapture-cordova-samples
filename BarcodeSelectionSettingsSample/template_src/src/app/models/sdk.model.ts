export enum Color {
  Default = 'rgba(255,255,255,0.2)',
  Blue = 'rgba(46, 193, 206,0.2)',
}

export enum Brush {
  Default = 'default', // special value, must be handled appropriately
  Blue = 'rgba(46, 193, 206,0.2)',
}

export enum BarcodeSelectionBasicOverlayStyle {
  Frame = 'frame',
  Dot = 'dot',
}

export enum BarcodeSelectionTypeName {
  Aimer = 'aimerSelection',
  Tap = 'tapSelection',
}

export enum BarcodeSelectionFreezeBehavior {
  Manual = 'manual',
  ManualAndAutomatic = 'manualAndAutomatic',
}

export enum BarcodeSelectionTapBehavior {
  ToggleSelection = 'toggleSelection',
  RepeatSelection = 'repeatSelection',
}

export enum BarcodeSelectionStrategyType {
  Auto = 'autoSelectionStrategy',
  Manual = 'manualSelectionStrategy',
}
