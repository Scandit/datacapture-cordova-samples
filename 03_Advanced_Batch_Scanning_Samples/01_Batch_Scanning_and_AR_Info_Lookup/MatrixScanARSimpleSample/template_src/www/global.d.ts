// Global type declarations for Cordova's global Scandit object
// Cordova merges all plugins into window.Scandit, so we need to declare it globally

import type * as ScanditCore from 'scandit-cordova-datacapture-core';
import type * as ScanditBarcode from 'scandit-cordova-datacapture-barcode';
import type * as ScanditId from 'scandit-cordova-datacapture-id';
import type * as ScanditParser from 'scandit-cordova-datacapture-parser';

declare global {
  const Scandit: typeof ScanditCore & typeof ScanditBarcode & typeof ScanditId & typeof ScanditParser;
  type Scandit = typeof ScanditCore & typeof ScanditBarcode & typeof ScanditId & typeof ScanditParser;
}

export {};
