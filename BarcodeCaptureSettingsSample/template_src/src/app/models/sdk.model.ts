export enum BrushColor {
  Default = 'rgba(255,255,255,0.2)',
  Red = 'rgba(255,0,0,0.2)',
  Green = 'rgba(0,255,0,0.2)',
}

export enum BarcodeCaptureOverlayStyle {
  Legacy = 'legacy',
  Frame = 'frame',
}

export enum ViewfinderColor {
  Black = 'rgba(0,0,0)',
  Red = 'rgba(255,0,0)',
  White = 'rgba(255,255,255)',
  Blue = 'rgba(0,0,255)',
  Transparent = 'rgba(0,0,0,0)',
}

export enum ViewfinderStyle {
  Legacy = 'legacy',
  Square = 'square',
  Rounded = 'rounded',
}

export enum LaserlineViewfinderStyle {
  Legacy = 'legacy',
  Animated = 'animated',
}

export enum ViewfinderLineStyle {
  Light = 'light',
  Bold = 'bold',
}

export enum SizeSpecification {
  WidthAndHeight = 'widthAndHeight',
  WidthAndHeightAspect = 'widthAndHeightAspect',
  HeightAndWidthAspect = 'heightAndWidthAspect',
  ShorterDimensionAndAspectRation = 'shorterDimensionAndAspectRatio',
}

export enum ViewfinderType {
  None = 'none',
  Laserline = 'laserline',
  Rectangular = 'rectangular',
  Aimer = 'aimer',
}

export enum LocationSelectionType {
  None = 'none',
  Radius = 'radius',
  Rectangular = 'rectangular',
}
