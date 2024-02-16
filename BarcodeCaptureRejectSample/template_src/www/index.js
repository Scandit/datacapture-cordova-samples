document.addEventListener('deviceready', () => {
  // There is a Scandit sample license key set below here.
  // This license key is enabled for sample evaluation only.
  // If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
  const context = Scandit.DataCaptureContext.forLicenseKey('AfUkdmKlRiP5FdlOFQnOhu4V3j5LFKttPGTWXFd7CkuRaTAstDqq78RrBm2ZG9LRu1T8CNgP6oLScGrUoEwfmP1TUXonIGCl2g9Fo5NYtmK/aEV8FX/YcdRKfWS5bJrTcWGDHdcsJxT6Me5C3RMdWZkdqeR5GEjDzT6dO4ZPWOBbNLjpkgZ0/MjtYQPKqSV+bSZC7+ekFaXovSKWfXV89BXtta/6sZHFJOMKxyvzh6zw5yA+NDR67OXoWKCrrNq4AOuBlt1ZelIHCqjQgTy/SZG110eJr5e4pth38Bx0fXE8FGX92BoxwJr1EG+P5CEJF8EFMy2zf87aJQYuzHmg0nM7czcNqLUd9F23uxntZYjKlwgWmmSzev/ozaumEvbW9RVW1bUQmV8pQ1SWILBuzQPeAw8iWOWgnTH18tH7cT+fUJumvM2rn7LWx9JYLAKBKRuwe2sDh3l5eqobZKdarIRsKVgXa4pw+gkYKuplzTo+Bzh70rbmtgq3IJ8hSpdoZITzfUQSwXkrgdQa5Cmrpxz9gXManBRt01h3eFXG7znZU9w0+uzzV/b5e6MQcPncODrCQOq0kfEBYgRoLAwVCOKnxyWQkqRbUpsTN2wy2MTg10flYhR/zf1eXdiUjgPUhWj8LtmgxJELYky7uMu46abfCkAw73e+12iJmlf9/tmTFk34La9ZQiF/BYps5h327ZW8qobay+Esx1i9dsaFKYt/nCN8jZdUYD/df+/vApyK4PMbph9EPRe5u0alg8BqpEExnkQsy1W7r85yngO/rxSXsY6rTMoTXb/87ul8uQnsrD41ZLtFdzo0OlbNTeNOI1mJz/E6/SOLbRRK');

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default;
  context.setFrameSource(camera);

  // The barcode capturing process is configured through barcode capture settings
  // and are then applied to the barcode capture instance that manages barcode recognition.
  const settings = new Scandit.BarcodeCaptureSettings();

  // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
  // sample we enable the QR symbology. In your own app ensure that you only enable the symbologies that your app
  // requires as every additional enabled symbology has an impact on processing times.
  settings.enableSymbologies([Scandit.Symbology.QR]);

  // Create new barcode capture mode with the settings from above.
  window.barcodeCapture = Scandit.BarcodeCapture.forContext(context, settings);

  // By default, every time a barcode is scanned, a sound (if not in silent mode) and a
  // vibration are played. In the following we are setting a success feedback without sound
  // and vibration.
  window.barcodeCapture.feedback = { success: new Scandit.Feedback() };

  // Register a listener to get informed whenever a new barcode got recognized.
  barcodeCapture.addListener({
    didScan: (barcodeCapture, session, _) => {
      const barcode = session.newlyRecognizedBarcodes[0];
      const symbology = new Scandit.SymbologyDescription(barcode.symbology);

      // If the code scanned doesn't start with '09:', we will just ignore it and continue
      // scanning.
      if (!barcode.data || !barcode.data.startsWith('09:')) {
        window.overlay.brush = Scandit.Brush.transparent;
        return;
      }

      window.overlay.brush = new Scandit.Brush(Scandit.Color.fromHex('FFF0'), Scandit.Color.fromHex('FFFF'), 3);

      // We also want to emit a feedback (vibration and, if enabled, sound).
      Scandit.Feedback.defaultFeedback.emit();

      // Stop recognizing barcodes for as long as we are displaying the result. There won't be any
      // new results until the capture mode is enabled again. Note that disabling the capture mode
      // does not stop the camera, the camera continues to stream frames until it is turned off.

      window.showResult(`Scanned: ${barcode.data} (${symbology.readableName})`);
      barcodeCapture.isEnabled = false;
    }
  });

  // To visualize the on-going barcode capturing process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('data-capture-view'));

  // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  window.overlay = Scandit.BarcodeCaptureOverlay
    .withBarcodeCaptureForViewWithStyle(barcodeCapture, view, Scandit.BarcodeCaptureOverlayStyle.Frame);
  window.overlay.viewfinder = new Scandit.RectangularViewfinder(
    Scandit.RectangularViewfinderStyle.Square,
    Scandit.RectangularViewfinderLineStyle.Light,
  );

  // Switch camera on to start streaming frames and enable the barcode capture mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On);
  barcodeCapture.isEnabled = true;
}, false);

window.showResult = result => {
  const resultElement = document.createElement('div');
  resultElement.id = "result";
  resultElement.classList = "result";
  resultElement.innerHTML = `<p>${result}</p><button onclick="continueScanning()">OK</button>`;
  document.querySelector('#data-capture-view').appendChild(resultElement)
}

window.continueScanning = () => {
  document.querySelector('#result').parentElement.removeChild(document.querySelector('#result'))
  window.barcodeCapture.isEnabled = true;
}
