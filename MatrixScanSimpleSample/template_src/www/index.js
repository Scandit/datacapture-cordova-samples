resetResults();

document.addEventListener('deviceready', () => {
  // There is a Scandit sample license key set below here.
  // This license key is enabled for sample evaluation only.
  // If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
  const context = Scandit.DataCaptureContext.forLicenseKey('AQIzpSC5AyYeKA6KZgjthjEmMbJBFJEpiUUjkCJu72AUVSWyGjN0xNt0OVgASxKO6FwLejYDRFGraFReiUwL8wp3a8mgX0elHhmx0JhY/QYrbQHJjGIhQAhjcW1cYr+ogWCDUmhM2KuWPlJXBkSGmbwinMAqKusC5zQHGoY6JDKJXbzv97CRhGdjlfgjhTZErgfs+P/fLp0cCCAmP+TTZ6jiyA/my9Ojy7ugt7DKay2ZAkezAO8OwAtnl0GUIflPz6KI68hRPaAV18wwS030+riqfDIcFQ+3BAfqRMpJxrYfKZOvvwyTAbC+5ZzgFmwd9YR0vbFToSmHDemEyRVufdMw0s+jqCHsCY5ox8jBfV1RkmDQxCckkJoS3rhPmLgEyiTm+gI0y30swn2orZ4aaml+aoA55vhN4jY+ZAkMkmhipAXK/TMzyHo4iUDA4/v3TgiJbodw27iI/+f6YxIpA+/nAEItRH7C3vuxAdo8lmk5q0QeCkc6QA0FhQa6S/cu8yrehTi+Lb8khFmt3gkwEubowGdg3cg8KoBsDgY59lAKWy55rmVznq7REv6ugw1KwgW724K4s5ILfgQ2NcV/jFgeTReaTSVYUWKZGXdJmDrteX7tgmdfkpjaCrijgSGwYRaATxVKitCYIPyfuipsSHdC0iLqCoJ8CIc2UclvimPXDzDLk83uIRFjgspykVm+eIsKiMuxrW6OlB7o7NWPcJtEcyO74Mq6scB8+bWP5eJFIPazUcZEtxG2u3UpWz7+EoBADwbUI9G63HcTwt2bi8JZo16pfGxsWti3DJ1HWooGSIVvyZ2jePvhBcuu+EbtOucgdPDvDTCTpm/V');

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
  ]);

  // Create new barcode tracking mode with the settings from above.
  const barcodeTracking = Scandit.BarcodeTracking.forContext(context, settings);

  // Register a listener to get informed whenever a new barcode is tracked.
  barcodeTracking.addListener({
    didUpdateSession: (barcodeTracking, session) => {
      Object.values(session.trackedBarcodes).forEach(trackedBarcode => {
        window.results[trackedBarcode.barcode.data] = trackedBarcode;
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
  const overlay = Scandit.BarcodeTrackingBasicOverlay
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
};

function resetResults() {
  window.results = {};
  document.getElementById('scanning').hidden = false;
  document.getElementById('results').hidden = true;
}

function done() {
  updateResults();
  document.getElementById('scanning').hidden = true;
  document.getElementById('results').hidden = false;
};

function scanAgain() {
  resetResults();
};
