document.addEventListener('deviceready', () => {
  // Enter your Scandit License key here.
  // Your Scandit License key is available via your Scandit SDK web account.
  const context = Scandit.DataCaptureContext.initialize('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default;
  context.setFrameSource(camera);

  // The barcode capturing process is configured through barcode capture settings
  // and are then applied to the barcode capture instance that manages barcode recognition.
  const settings = new Scandit.BarcodeCaptureSettings();

  // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
  // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
  // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
  settings.enableSymbologies([
    Scandit.Symbology.EAN13UPCA,
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.QR,
    Scandit.Symbology.DataMatrix,
    Scandit.Symbology.Code39,
    Scandit.Symbology.Code128,
    Scandit.Symbology.InterleavedTwoOfFive,
  ]);

  // Some linear/1d barcode symbologies allow you to encode variable-length data. By default, the Scandit
  // Data Capture SDK only scans barcodes in a certain length range. If your application requires scanning of one
  // of these symbologies, and the length is falling outside the default range, you may need to adjust the "active
  // symbol counts" for this symbology. This is shown in the following few lines of code for one of the
  // variable-length symbologies.
  const symbologySettings = settings.settingsForSymbology(Scandit.Symbology.Code39);
  symbologySettings.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  // Create new barcode capture mode with the settings from above.
  window.barcodeCapture = new Scandit.BarcodeCapture(settings);

  // By default, every time a barcode is scanned, a sound (if not in silent mode) and a vibration are played.
  // Uncomment the following lines to set a success feedback without sound and vibration.
  // const feedback = Scandit.BarcodeCaptureFeedback.default;
  // feedback.success = new Scandit.Feedback(null, null);
  // window.barcodeCapture.feedback = feedback;

  // Register a listener to get informed whenever a new barcode got recognized.
  barcodeCapture.addListener({
    didScan: (barcodeCapture, session, _) => {
      const barcode = session.newlyRecognizedBarcode;
      if (barcode == null) return;

      // Use the following code to reject barcodes.
      // By uncommenting the following lines, barcodes not starting with 09: are ignored.
      // if (!barcode.data?.startsWith('09:')) {
      //   // We temporarily change the brush, used to highlight recognized barcodes, to a transparent brush.
      //   window.overlay.brush = Scandit.Brush.transparent;
      //   return;
      // }
      // Otherwise, if the barcode is of interest, we want to use a brush to highlight it.
      // window.overlay.brush = new Scandit.Brush(
      //   Scandit.Color.fromHex('FFFF0'),
      //   Scandit.Color.fromHex('FFFFF'),
      //   3
      // );

      // We also want to emit a feedback (vibration and, if enabled, sound).
      // By default, every time a barcode is scanned, a sound (if not in silent mode) and a vibration are played.
      // To emit a feedback only when necessary, it is necessary to set a success feedback without sound and
      // vibration when setting up Barcode Capture (in this case in the `setupScanning`.
      // Scandit.Feedback.defaultFeedback.emit();

      const symbology = new Scandit.SymbologyDescription(barcode.symbology);

      // The `alert` call blocks execution until it's dismissed by the user. As no further frames would be processed
      // until the alert dialog is dismissed, we're showing the alert through a timeout and disabling the barcode
      // capture mode until the dialog is dismissed, as you should not block the BarcodeCaptureListener callbacks for
      // longer periods of time. See the documentation to learn more about this.

      window.showResult(`Scanned: ${barcode.data} (${symbology.readableName})`);
      barcodeCapture.isEnabled = false;
    }
  });

  // Add mode to context
  context.setMode(window.barcodeCapture);

  // To visualize the on-going barcode capturing process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('data-capture-view'));

  // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
  // the video preview. This is optional, but recommended for better visual feedback.
  window.overlay = new Scandit.BarcodeCaptureOverlay(window.barcodeCapture);
  window.overlay.viewfinder = new Scandit.RectangularViewfinder(
    Scandit.RectangularViewfinderStyle.Square,
    Scandit.RectangularViewfinderLineStyle.Light,
  );

  // Add overlay to view
  view.addOverlay(window.overlay);

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
