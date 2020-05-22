const Elements = {
  dataCaptureView: document.getElementById('data-capture-view'),
}

let targetedBarcode = null;
let timeout = null;

document.addEventListener('deviceready', () => {

  // We save the center point of screen to compare with barcode locations.
  const center = new Scandit.Point(
    Elements.dataCaptureView.getBoundingClientRect().width / 2.0,
    Elements.dataCaptureView.getBoundingClientRect().height / 2.0
  );

  // Create data capture context using your license key.
  const context = Scandit.DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  // Use the default camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  window.camera = Scandit.Camera.default;
  context.setFrameSource(window.camera);

  // Use the recommended camera settings for the BarcodeTracking mode as default settings.
  // The preferred resolution is automatically chosen, which currently defaults to HD on all devices.
  // Setting the preferred resolution to full HD helps to get a better decode range.
  const cameraSettings = Scandit.BarcodeTracking.recommendedCameraSettings;
  cameraSettings.preferredResolution = Scandit.VideoResolution.FullHD;
  window.camera.applySettings(cameraSettings).catch(console.warn);

  // The barcode tracking process is configured through barcode tracking settings
  // and are then applied to the barcode tracking instance that manages barcode tracking.
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
  window.barcodeTracking = Scandit.BarcodeTracking.forContext(context, settings);

  // To visualize the on-going barcode tracking process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  window.view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  window.view.connectToElement(Elements.dataCaptureView);

  // Add a barcode tracking overlay to the data capture view to render the tracked barcodes on top of the video
  // preview. This is optional, but recommended for better visual feedback. The overlay is automatically added
  // to the view.
  const defaultBrush = new Scandit.Brush(Scandit.Color.fromHex('FFF9'), Scandit.Color.fromHex('FFFF'), 2);
  const selectBrush = new Scandit.Brush(Scandit.Color.fromHex('15D82BBD'), Scandit.Color.fromHex('00FF14FF'), 2);
  window.basicOverlay = Scandit.BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(barcodeTracking, window.view);
  window.basicOverlay.defaultBrush = defaultBrush;

  // Add an advanced barcode tracking overlay to the data capture view to render AR visualization on top of
  // the camera preview.
  window.advancedOverlay = Scandit.BarcodeTrackingAdvancedOverlay.withBarcodeTrackingForView(barcodeTracking, window.view);
  window.advancedOverlay.listener = {
    anchorForTrackedBarcode: (overlay, trackedBarcode) => Scandit.Anchor.TopCenter,
    offsetForTrackedBarcode: (overlay, trackedBarcode) => new Scandit.PointWithUnit(
      new Scandit.NumberWithUnit(0, Scandit.MeasureUnit.Fraction),
      new Scandit.NumberWithUnit(-0.75, Scandit.MeasureUnit.Fraction),
    ),
  };

  // Register a listener to get informed of tracked barcodes.
  window.barcodeTracking.addListener({
    // This function is called whenever objects are updated and it's the right place to react to the tracking results.
    didUpdateSession: (barcodeTracking, session) => {
      if (targetedBarcode !== null &&
        session.removedTrackedBarcodes.find(id => id == targetedBarcode.identifier) !== undefined) {
        targetedBarcode = null
      }

      // Update visualizations
      Object.values(session.trackedBarcodes).forEach(trackedBarcode =>
        window.view.viewQuadrilateralForFrameQuadrilateral(trackedBarcode.barcode.location)
          .then(location => {
            if (overlapsCenter(center, location)) {
              targetedBarcode = trackedBarcode;

              window.basicOverlay.setBrushForTrackedBarcode(selectBrush, trackedBarcode).catch(console.warn);

              const bubble = Scandit.TrackedBarcodeView.withHTMLElement(
                createBubbleWithContent(),
                // To get the best possible AR view quality, it is suggested to set AR view sizes with taking into account
                // the device pixel ratio and scale them down based on it.
                { scale: 1 / window.devicePixelRatio },
              );
              window.advancedOverlay.setViewForTrackedBarcode(bubble, trackedBarcode).catch(console.warn);
            } else {
              if (targetedBarcode != null && targetedBarcode.identifier == trackedBarcode.identifier) {
                targetedBarcode = null
              }

              window.basicOverlay.setBrushForTrackedBarcode(defaultBrush, trackedBarcode).catch(console.warn);
              window.advancedOverlay.setViewForTrackedBarcode(null, trackedBarcode).catch(console.warn);
            }
          })
      );
    }
  });

  // Switch camera on to start streaming frames and enable the barcode tracking mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  window.camera.switchToDesiredState(Scandit.FrameSourceState.On);
  window.barcodeTracking.isEnabled = true;
}, false);

const overlayTap = () => {
  if (targetedBarcode != null) {
    showResult(`Scanned: ${targetedBarcode.barcode.data}`);
  }
};

const overlapsCenter = (center, location) => {
  const corners = [location.topLeft, location.topRight, location.bottomRight, location.bottomLeft]

  corners.forEach(corner => {
    if (corner == center) {
      return true;
    }
  });

  let result = false;
  const numCorners = 4;
  for (i = 0, j = numCorners - 1; i < numCorners; j = i++) {

    const cornerI = corners[i];
    const cornerJ = corners[j];

    if (((cornerI.y > center.y) != (cornerJ.y > center.y))) {
      if ((center.x < (cornerJ.x - cornerI.x) * (center.y - cornerI.y) / (cornerJ.y - cornerI.y) + cornerI.x)) {
        result = !result;
      }
    }
  }

  return result;
};

const createBubbleWithContent = () => {
  const bubbleWidth = 180;
  const bubbleHeight = 40;

  const container = document.createElement("div");
  container.style.width = `${bubbleWidth * window.devicePixelRatio}px`;
  container.style.height = `${bubbleHeight * window.devicePixelRatio}px`;
  container.style.borderRadius = `${(bubbleHeight / 4) * window.devicePixelRatio}px`;
  container.style.backgroundColor = "#ffff"
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.fontFamily = "Helvetica Neue";
  container.style.fontSize = `${14 * window.devicePixelRatio}px`;

  const title = document.createElement("p");
  title.style.margin = "0";
  title.style.fontWeight = "bold";
  title.innerText = "Tap to add to list";
  container.appendChild(title);

  return container;
};

const showResult = result => {
  cancelTimeout();

  const resultElement = document.createElement('div');
  resultElement.id = "result";
  resultElement.classList = "result";
  resultElement.innerHTML = `<p>${result}</p>`;
  document.querySelector('#overlay-view').appendChild(resultElement)

  timeout = setTimeout(hideResult, 2000);
};

const hideResult = () => {
  timeout = null;
  document.querySelector('#overlay-view').innerHTML = '';
};

const cancelTimeout = () => {
  if (timeout != null) {
    clearTimeout(timeout);
    timeout = null;
  }
};
