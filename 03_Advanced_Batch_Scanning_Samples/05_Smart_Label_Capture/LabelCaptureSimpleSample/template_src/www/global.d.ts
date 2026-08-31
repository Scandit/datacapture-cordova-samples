// Global type declarations for Cordova's global Scandit object
// Cordova merges all plugins into window.Scandit, so we need to declare it globally

import type * as ScanditCore from 'scandit-cordova-datacapture-core';
import type * as ScanditBarcode from 'scandit-cordova-datacapture-barcode';
import type * as ScanditLabel from 'scandit-cordova-datacapture-label';

declare global {
  const Scandit: typeof ScanditCore & typeof ScanditBarcode & typeof ScanditLabel;
  type Scandit = typeof ScanditCore & typeof ScanditBarcode & typeof ScanditLabel;
}

export {};
