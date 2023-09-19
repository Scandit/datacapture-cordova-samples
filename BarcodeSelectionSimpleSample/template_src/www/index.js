document.addEventListener('deviceready', () => {
  // There is a Scandit sample license key set below here.
  // This license key is enabled for sample evaluation only.
  // If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
  const context = Scandit.DataCaptureContext.forLicenseKey('AYjTKgwFKLhZGtmHmyNAawklGVUpLfmaJ2JN39hPFcbHRdb8Sh3UX45m7PRkJtORsQzsAeBZw7aAZ/VBZlp5ykVZZOOYUI8ZAxAsZ3tOrh5HXX2CzFyh2yNzGtUXQuR5eFHqhXNx8+mfbsvN2zErPt0+TW4TESKXSx4764U8HnIF/01crbTR4/qxeWvIgdmGJkoV2YZc4wfZjpQI2Uvd3/J2jFcv/WrVHgWZ/VAC2lHTzC3JdwtTNJKxxDpsqKp1sDlARxGjw4hlebrAUbft3aWMjbtpVn2T4D+tBN3GVuwlD9Uo7MN3Sto17fSVSD1JLymYPHP7zxsnByy9mCBhKqTf3YKCh8DughdNJpIIWaaoY6t6OTof+TxY25XAboYM1Ii3FdaK1MjK2x9bVujInqaIYzPRYRwQj6lPyVaYSiRRJTsR6l3RLXyorSeqM6Mjyspyb9Gl3ht1grXe8TzMwVUFLYwBlV1zYcKfCVxHIaPo8irO1X7+sImu0166pNeK962FxzUx+rJMsvEIhy8mzF//yRI8WBLZvuBS5AH8EJHBb5p6DcdLgNVf3AwQWw6S5ENIw1Nu+eS2p+nm7msRRWP5jbqo8TfwgoellmtHaljlvmQ47kXfZvo9feDd7qZtGvWuX22yZkb+3k0OEfNKZaBKLrfzKU6X5TlmMvyhU7mF6mMdkBwex+NuKhRl1fYVjzD1hk75j70/QgXyjMv9nJpSEIXEt//AVHZTG4lGvAT0l3hPOie/zS0ixEH11+LJvbzsZQXYngggsJ40oCbajRxnvrMEcJQ5Lcxnp/Ov8qTmApOqK+XmLAV/s+MdeeIatFNTk6o9xGar+cB8');

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default;
  context.setFrameSource(camera);

  // Use the recommended camera settings for the BarcodeSelection mode as default settings.
  const cameraSettings = Scandit.BarcodeSelection.recommendedCameraSettings;
  camera.applySettings(cameraSettings).catch(console.warn);

  // The barcode selection process is configured through barcode selection settings
  // and are then applied to the barcode selection instance that manages barcode recognition.
  window.barcodeSelectionSettings = new Scandit.BarcodeSelectionSettings();

  // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
  // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
  // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
  window.barcodeSelectionSettings.enableSymbologies([
    Scandit.Symbology.EAN13UPCA,
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.QR,
    Scandit.Symbology.DataMatrix,
    Scandit.Symbology.Code39,
    Scandit.Symbology.Code128,
  ]);

  // Create new barcode selection mode with the settings from above.
  window.barcodeSelection = Scandit.BarcodeSelection.forContext(context, window.barcodeSelectionSettings);

  // Register a listener to get informed whenever a new barcode got recognized.
  window.barcodeSelection.addListener({
    didUpdateSelection: (barcodeSelection, session, _) => {
      const barcode = session.newlySelectedBarcodes[0];

      if (!barcode) { return }

      const symbology = new Scandit.SymbologyDescription(barcode.symbology);

      session.getCount(barcode).then(count => {
        window.showResult(`Scan Results<br>${symbology.readableName}: ${barcode.data}<br>Times: ${count}`);
      });
    }
  });

  // To visualize the on-going barcode selection process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('data-capture-view'));

  // Add a barcode selection overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  const overlay = Scandit.BarcodeSelectionBasicOverlay.withBarcodeSelectionForView(window.barcodeSelection, view);

  window.toggleBarcodeSelectionType(true);
  // Switch camera on to start streaming frames and enable the barcode selection mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On);
  window.barcodeSelection.isEnabled = true;
}, false);

window.showResult = result => {
  if (document.querySelector('#result')) {
    document.querySelector('#result').parentElement.removeChild(document.querySelector('#result'));
  }

  const resultElement = document.createElement('div');
  resultElement.id = "result";
  resultElement.classList = "result";
  resultElement.innerHTML = `<p>${result}</p>`;
  document.querySelector('#data-capture-view').appendChild(resultElement);
  document.getElementById('data-capture-view').style.zIndex = -1;

  clearTimeout(window.timeout);
  window.timeout = setTimeout(window.continueScanning, 500);
}

window.continueScanning = () => {
  document.getElementById('data-capture-view').style.zIndex = 1;
  document.querySelector('#result').parentElement.removeChild(document.querySelector('#result'));
}

window.toggleBarcodeSelectionType = (forceIsTapSelection) => {
  if (forceIsTapSelection === true || window.barcodeSelectionSettings.selectionType instanceof Scandit.BarcodeSelectionAimerSelection) {
    document.getElementById('tapToSelect').className = 'selected';
    document.getElementById('aimToSelect').className = '';
    window.barcodeSelectionSettings.selectionType = Scandit.BarcodeSelectionTapSelection.tapSelection;
    window.barcodeSelection.applySettings(window.barcodeSelectionSettings);
  } else {
    document.getElementById('tapToSelect').className = '';
    document.getElementById('aimToSelect').className = 'selected';
    window.barcodeSelectionSettings.selectionType = Scandit.BarcodeSelectionAimerSelection.aimerSelection;
    window.barcodeSelection.applySettings(window.barcodeSelectionSettings);
  }
}
