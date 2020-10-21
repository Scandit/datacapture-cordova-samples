document.addEventListener('deviceready', () => {
  // Create data capture context using your license key.
  const context = Scandit.DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default;
  context.setFrameSource(camera);

  // Use the recommended camera settings for the BarcodeTracking mode as default settings.
  // The preferred resolution is automatically chosen, which currently defaults to HD on all devices.
  // Setting the preferred resolution to full HD helps to get a better decode range.
  const cameraSettings = Scandit.BarcodeTracking.recommendedCameraSettings;
  cameraSettings.preferredResolution = Scandit.VideoResolution.FullHD;
  camera.applySettings(cameraSettings).catch(console.warn);

  // The barcode tracking process is configured through barcode tracking settings
  // and are then applied to the barcode tracking instance that manages barcode recognition.
  const settings = Scandit.BarcodeTrackingSettings.forScenario(Scandit.BarcodeTrackingScenario.A);

  // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
  // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
  // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
  settings.enableSymbologies([
    Scandit.Symbology.EAN13UPCA,
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.Code128,
    Scandit.Symbology.Code39,
    Scandit.Symbology.DataMatrix,
  ]);

  // Create new barcode trackign mode with the settings from above.
  const barcodeTracking = Scandit.BarcodeTracking.forContext(context, settings);

  // Register a listener to get informed whenever a new barcode got recognized.
  barcodeTracking.addListener({
    didUpdateSession: (barcodeTracking, session) => {
      window.latestBarcodeTrackingSession = session;
      session.addedTrackedBarcodes.forEach(trackedBarcode => {
        window.barcodeTrackingBasicOverlay.setBrushForTrackedBarcode(
          new Scandit.Brush(Scandit.Color.fromHex('FFF7'), Scandit.Color.fromHex('FFFA'), 1),
          trackedBarcode);
      });
    }
  });

  // To visualize the on-going barcode capturing process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('data-capture-view'));

  // Add a barcode tracking overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview.
  window.barcodeTrackingBasicOverlay = Scandit.BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(barcodeTracking, view);

  // Switch camera on to start streaming frames and enable the barcode capture mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On);
  barcodeTracking.isEnabled = true;
}, false);

const addCurrentTrackedBarcodes = () => {
  window.collectedTrackedBarcodes = window.collectedTrackedBarcodes || {};
  Object.values(window.latestBarcodeTrackingSession.trackedBarcodes).forEach(trackedBarcode => {
    const id = `${trackedBarcode.barcode.symbology}-${trackedBarcode.barcode.data}`;
    window.collectedTrackedBarcodes[id] = (window.collectedTrackedBarcodes[id] || 0) + 1;
  });
  console.log(window.collectedTrackedBarcodes);

  updateUI();
};

const clearTrackedBarcodes = () => {
  window.collectedTrackedBarcodes = {};
  updateUI();
}

const updateUI = () => {
  if (Object.keys(window.collectedTrackedBarcodes).length > 0) {
    document.getElementById('hint').hidden = true;
    document.getElementById('clear').hidden = false;
    document.getElementById('tracked-barcode-list').hidden = false;
    document.getElementById('tracked-barcode-list').innerHTML = Object.entries(window.collectedTrackedBarcodes).map(trackedBarcodeRow).join('');
  } else {
    document.getElementById('hint').hidden = false;
    document.getElementById('clear').hidden = true;
    document.getElementById('tracked-barcode-list').hidden = true;
    document.getElementById('tracked-barcode-list').innerText = "";
  }
}

const trackedBarcodeRow = ([id, no]) => {
  const row = document.createElement('div');
  row.className = 'row';

  const innerRow = document.createElement('div');
  row.appendChild(innerRow);

  const data = document.createElement('span');
  data.className = 'data';
  data.innerText = id.split('-')[1];
  innerRow.appendChild(data);

  const count = document.createElement('span');
  count.className = 'count';
  count.innerText = no;
  innerRow.appendChild(count);

  const symbology = document.createElement('span');
  symbology.className = 'symbology';
  symbology.innerText = new Scandit.SymbologyDescription(id.split('-')[0]).readableName;
  row.appendChild(symbology);

  return row.outerHTML;
};
