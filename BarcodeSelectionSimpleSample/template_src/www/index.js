document.addEventListener('deviceready', () => {
  // There is a Scandit sample license key set below here.
  // This license key is enabled for sample evaluation only.
  // If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
  const context = Scandit.DataCaptureContext.forLicenseKey('AfUkdmKlRiP5FdlOFQnOhu4V3j5LFKttPGTWXFd7CkuRaTAstDqq78RrBm2ZG9LRu1T8CNgP6oLScGrUoEwfmP1TUXonIGCl2g9Fo5NYtmK/aEV8FX/YcdRKfWS5bJrTcWGDHdcsJxT6Me5C3RMdWZkdqeR5GEjDzT6dO4ZPWOBbNLjpkgZ0/MjtYQPKqSV+bSZC7+ekFaXovSKWfXV89BXtta/6sZHFJOMKxyvzh6zw5yA+NDR67OXoWKCrrNq4AOuBlt1ZelIHCqjQgTy/SZG110eJr5e4pth38Bx0fXE8FGX92BoxwJr1EG+P5CEJF8EFMy2zf87aJQYuzHmg0nM7czcNqLUd9F23uxntZYjKlwgWmmSzev/ozaumEvbW9RVW1bUQmV8pQ1SWILBuzQPeAw8iWOWgnTH18tH7cT+fUJumvM2rn7LWx9JYLAKBKRuwe2sDh3l5eqobZKdarIRsKVgXa4pw+gkYKuplzTo+Bzh70rbmtgq3IJ8hSpdoZITzfUQSwXkrgdQa5Cmrpxz9gXManBRt01h3eFXG7znZU9w0+uzzV/b5e6MQcPncODrCQOq0kfEBYgRoLAwVCOKnxyWQkqRbUpsTN2wy2MTg10flYhR/zf1eXdiUjgPUhWj8LtmgxJELYky7uMu46abfCkAw73e+12iJmlf9/tmTFk34La9ZQiF/BYps5h327ZW8qobay+Esx1i9dsaFKYt/nCN8jZdUYD/df+/vApyK4PMbph9EPRe5u0alg8BqpEExnkQsy1W7r85yngO/rxSXsY6rTMoTXb/87ul8uQnsrD41ZLtFdzo0OlbNTeNOI1mJz/E6/SOLbRRK');

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
