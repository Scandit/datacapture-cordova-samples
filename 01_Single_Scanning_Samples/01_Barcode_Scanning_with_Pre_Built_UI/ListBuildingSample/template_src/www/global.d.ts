// Global type declarations for Cordova's global Scandit object
// Cordova merges all plugins into window.Scandit, so we need to declare it globally

import type * as ScanditCore from 'scandit-cordova-datacapture-core';
import type * as ScanditBarcode from 'scandit-cordova-datacapture-barcode';

declare global {
  const Scandit: typeof ScanditCore & typeof ScanditBarcode;
  type Scandit = typeof ScanditCore & typeof ScanditBarcode;
}

export {};
