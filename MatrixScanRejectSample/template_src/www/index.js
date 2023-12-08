resetResults();

document.addEventListener('deviceready', () => {
  // There is a Scandit sample license key set below here.
  // This license key is enabled for sample evaluation only.
  // If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
  const context = Scandit.DataCaptureContext.forLicenseKey('AW7z5wVbIbJtEL1x2i7B3/cet/ClBNVHZTfPtvJ2n3L/LY6/FDbqtzYItFO0DmhIJ2JP1Vxu7po1f74HqF9UTtRB/1DHY+CJdTiq/6dQ8vFgd9rzwlVfSYFgWPp9fK5nVUmnHyt9W5oRMcXObjYeC7Q/FO0NA0yRHUEtt/aBpnv/AxYTKG8wyVNqZKMJn+bhz/CFbH5pjtdj2aE85TlPGfQK4sBP/K2ONcx2ndbmY82SOquLlcZ55uAFuj4yCuQEI6iuokblpDVsql+vDiw3XMOmqwbmuGnAuCtGbtjyyWyQCKeiKWtZzdy+Cz7NnW/yRdwKY1xBjkaMA+A+NWeBxp9O2Ou6dBCPsRPg0Nqfv92sbv050dQc/+xccvEXWSi8UnD+AQoKp5V3gR/Yae/5+4fII9X3Tqjf/aNvXDw3m7YDQ+b+IJnkzLN5EgwGnzUmI8z3qMx9xcqhkWwBE/SSuIP47tBp5xwz02kN6qb+vZc/1p5EUQ/VtGVBfD1e+5Dii56BHsfPId/JpKpGUX1FFAYuT1uEbf7xLREDtFobn05tDxYPLrCa0hciRwCdWxHbUnYR1BF3zQQHih5Dd5qGyA5yKsgCsg7Na+9gC8O6hxpWlB4SbIFMEDluvJ+0v0ww5nnP2PWAO7v4k+Sgn7cQa7gDhQNee+pfuDvUlprUufio+dUmOUYNbn2TVwRVATmPx4U+p8Acg+Ohj85bSwPk+cNoq3Te6N0Ts5JnwrjCvVq6yrfbqyGFbgIhJiSxtgiZOfMZu8KoCvBfIUFE2A5WlNNaMZmQAtPozR31iX/Z2LuCIBhkFXGdd9CW/YPKhs8m25jlbOKnl0DWiBnM');

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default;
  camera.preferredResolution = Scandit.VideoResolution.FullHD;
  context.setFrameSource(camera);

  // The barcode tracking process is configured through barcode tracking settings
  // which are then applied to the barcode tracking instance that manages barcode tracking.
  const settings = new Scandit.BarcodeTrackingSettings();

  // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
  // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
  // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
  settings.enableSymbologies([
    Scandit.Symbology.EAN13UPCA,
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.Code39,
    Scandit.Symbology.Code128,
    Scandit.Symbology.QR,
  ]);

  // Create new barcode tracking mode with the settings from above.
  const barcodeTracking = Scandit.BarcodeTracking.forContext(context, settings);
  const rejectBrush = new Scandit.Brush(Scandit.Color.fromRGBA(255, 255, 255, 0), Scandit.Color.fromHex('#FA4446'), 3);
  const acceptBrush = new Scandit.Brush(Scandit.Color.fromRGBA(255, 255, 255, 0), Scandit.Color.fromHex('#26D381'), 3);

  // Register a listener to get informed whenever a new barcode is tracked.
  barcodeTracking.addListener({
    didUpdateSession: (mode, session) => {
      Object.values(session.trackedBarcodes).forEach(trackedBarcode => {
        // If the code scanned starts with '7' we will ignore it and mark with red brush
        if (trackedBarcode.barcode.data.startsWith('7')) {
          window.overlay.setBrushForTrackedBarcode(rejectBrush, trackedBarcode);
        } else {
          window.overlay.setBrushForTrackedBarcode(acceptBrush, trackedBarcode);
          window.results[trackedBarcode.barcode.data] = trackedBarcode;
        }
      });
    }
  });

  // To visualize the on-going barcode tracking process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('data-capture-view'));

  // Add a barcode tracking overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  window.overlay = Scandit.BarcodeTrackingBasicOverlay
    .withBarcodeTrackingForViewWithStyle(barcodeTracking, view, Scandit.BarcodeTrackingBasicOverlayStyle.Frame);

  // Switch camera on to start streaming frames and enable the barcode tracking mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On);
  barcodeTracking.isEnabled = true;
}, false);

function updateResults() {
  const list = document.getElementById('list');
  list.innerHTML = Object.values(window.results)
    .map(trackedBarcode => {
      const dataHTML = `<p class="barcodeData">${trackedBarcode.barcode.data}</p>`
      const symbology = new Scandit.SymbologyDescription(trackedBarcode.barcode.symbology);
      const symbologyHTML = `<p class="symbology">${symbology.readableName}</p>`
      return `<div class="result">${dataHTML}${symbologyHTML}</div>`;
    })
    .join('');
}

function resetResults() {
  window.results = {};
  document.getElementById('scanning').hidden = false;
  document.getElementById('results').hidden = true;
}

function done() {
  updateResults();
  document.getElementById('scanning').hidden = true;
  document.getElementById('results').hidden = false;
}

function scanAgain() {
  resetResults();
}
