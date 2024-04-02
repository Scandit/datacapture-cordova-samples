const isViewShowingAlternateContent = {};
const viewContents = {};

const Elements = {
  dataCaptureView: document.getElementById('data-capture-view'),
  freezeButton: document.getElementById('freeze-button'),
}

document.addEventListener('deviceready', () => {
  // Calculate the width of a quadrilateral (barcode location) based on it's corners.
  Scandit.Quadrilateral.prototype.width = function () {
    return Math.max(this.topRight.x - this.topLeft.x, this.bottomRight.x - this.bottomLeft.x);
  }

	// There is a Scandit sample license key set below here.
	// This license key is enabled for sample evaluation only.
	// If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
  const context = Scandit.DataCaptureContext.forLicenseKey('Aa2k0xbKMtvDJWNgLU02Cr8aLxUjNtOuqXCjHUxVAUf/d66Y5Tm74sJ+8L0rGQUZ20e52VlMY9I7YW4W13kWbvp36R8jbqQy6yZUGS50G5n4fRItJD6525RcbTYZQjoIGHQqle9jj08ra19ZUy9RliVlOn3hHz4WrGO8vORyATmFXJpULzk0I5RpiT84ckXhG2Ri8jtIzoISX3zsoiLtXVRGjjrkbuGZzGbKA180JKEpdfSQwVyupLti5yNYHAeKihS6IOklCTz8CM1BfRC4zBdIDjbVEJPFgAsLvMU0rTyJhHkB5Ds4wfHbKNFhW0T2XkYLKkvZ7X/HnEVD5oz9Kl4T4rtRkepJfsXUWHUgVugjLO5vqwhMcHNV5XpK2Pk/SLrzGF1PDRu8f4ZhBLrWKknWq+5TSK8GWi4wmGpVvbxqHhLljzOzplYs8I5TtphZ3otJNLs10lhk1YN9cmdaxpdUuF4k0WDU1Qfco75p5G+MBlsAVVFrs0xMF9fSMJkQ+4UU+G+py5781HPkpw4kaGwmJhGrzA/Lbhf4tL+XfynseLw42oygpfVabYEYRHSQx+1j5RpFSR6V9t4jlKsJu2xgYz0A96I82gIHItRRxZkT2oEsZCgYlgCiQsFcsFdo9N9bzDL9mVR5Nj0RPIVvKc01AVtKvXLx86g2rNPv45eBaJFrdsWmv97V8+Pv6M9d+Wr1qcTeT1BY8fvWUEDmU1HF6eCJ1A6cDAM+Nq4sAP9D2lH7D6rHwK+x07F56bMZibLeDoGKanE8PhhamhxBVemE/ByCoMoItBtSbpeBubHVsSHlGF3/AAKi6flY6j0htptgPOM8eOwGXx6YvVxu3KOMF+2RBIQai8LP0YEuhVJ0ST7WX5seeVSu5RMKUx/euHoQB6qID+ydzkXGzYZLTPPskmJSWqrboJQPIjZ/ruCtJepZ/+Lr7g5nCyb01w==');

  // Use the recommended camera settings for the BarcodeTracking mode as default settings.
  // The preferred resolution is automatically chosen, which currently defaults to HD on all devices.
  // Setting the preferred resolution to 4K helps to get a better decode range.
  const cameraSettings = Scandit.BarcodeTracking.recommendedCameraSettings;
  cameraSettings.preferredResolution = Scandit.VideoResolution.UHD4K;

  // Use the default camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  window.camera = Scandit.Camera.withSettings(cameraSettings);
  context.setFrameSource(window.camera);

  // The barcode tracking process is configured through barcode tracking settings
  // and are then applied to the barcode tracking instance that manages barcode tracking.
  const settings = Scandit.BarcodeTrackingSettings.forScenario(Scandit.BarcodeTrackingScenario.A);

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

  // Register a listener to get informed of tracked barcodes.
  window.barcodeTracking.addListener({
    // This function is called whenever objects are updated and it's the right place to react to the tracking results.
    didUpdateSession: (barcodeTracking, session) => {
      // Remove information about tracked barcodes that are no longer tracked.
      session.removedTrackedBarcodes.forEach(identifier => {
        isViewShowingAlternateContent[identifier] = null;
        viewContents[identifier] = null;
      });

      // Update AR views
      Object.values(session.trackedBarcodes).forEach(trackedBarcode =>
        window.view.viewQuadrilateralForFrameQuadrilateral(trackedBarcode.location)
          .then(location => updateView(trackedBarcode, location, isViewShowingAlternateContent[trackedBarcode.identifier])));

      session.addedTrackedBarcodes.forEach(trackedBarcode => {
        // The offset of our overlay will be calculated from the top center anchoring point.
        window.advancedOverlay.setAnchorForTrackedBarcode(Scandit.Anchor.TopCenter, trackedBarcode).catch(console.warn);
        // We set the offset's height to be equal of the 100 percent of our overlay.
        // The minus sign means that the overlay will be above the barcode.
        window.advancedOverlay.setOffsetForTrackedBarcode(
          new Scandit.PointWithUnit(
            new Scandit.NumberWithUnit(0, Scandit.MeasureUnit.Fraction),
            new Scandit.NumberWithUnit(-1, Scandit.MeasureUnit.Fraction)
          ), trackedBarcode).catch(console.warn);
      });
    }
  });

  // To visualize the on-going barcode tracking process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  window.view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  window.view.connectToElement(Elements.dataCaptureView);

  // Add a barcode tracking overlay to the data capture view to render the tracked barcodes on top of the video
  // preview. This is optional, but recommended for better visual feedback. The overlay is automatically added
  // to the view.
  const basicOverlay = Scandit.BarcodeTrackingBasicOverlay
    .withBarcodeTrackingForViewWithStyle(barcodeTracking, window.view, Scandit.BarcodeTrackingBasicOverlayStyle.Dot);

  // Add an advanced barcode tracking overlay to the data capture view to render AR visualization on top of
  // the camera preview.
  window.advancedOverlay = Scandit.BarcodeTrackingAdvancedOverlay.withBarcodeTrackingForView(barcodeTracking, window.view);
  window.advancedOverlay.listener = {
    didTapViewForTrackedBarcode: (overlay, trackedBarcode) => {
      window.view.viewQuadrilateralForFrameQuadrilateral(trackedBarcode.location)
        .then(location => updateView(trackedBarcode, location, !isViewShowingAlternateContent[trackedBarcode.identifier]));
    },
  }

  // Switch camera on to start streaming frames and enable the barcode tracking mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  window.camera.switchToDesiredState(Scandit.FrameSourceState.On);
  window.barcodeTracking.isEnabled = true;
}, false);

const freeze = () => {
  // Disable barcode tracking to stop processing frames.
  window.barcodeTracking.isEnabled = false
  // Switch the camera off to stop streaming frames. The camera is stopped asynchronously.
  window.camera.switchToDesiredState(Scandit.FrameSourceState.Off)
}

const unfreeze = () => {
  // Enable barcode tracking to resume processing frames.
  window.barcodeTracking.isEnabled = true
  // Switch the camera on to start streaming frames. The camera is started asynchronously.
  window.camera.switchToDesiredState(Scandit.FrameSourceState.On)
}

const toggleFreeze = () => {
  if (Elements.freezeButton.className == "freeze") {
    freeze();
    Elements.freezeButton.className = "unfreeze";
  } else {
    unfreeze();
    Elements.freezeButton.className = "freeze";
  }
}

const updateView = (trackedBarcode, viewLocation, isShowingAlternateContent = false) => {
  isViewShowingAlternateContent[trackedBarcode.identifier] = isShowingAlternateContent;

  // If the barcode is wider than the desired percent of the data capture view's width, show it to the user.
  const shouldBeShown = viewLocation.width() > (screen.width * 0.1);
  var viewContent = null;
  if (shouldBeShown) {
    // Get the information you want to show from your back end system/database.
    viewContent = isShowingAlternateContent
      ? { title: trackedBarcode.barcode.data }
      : { title: "Report stock count", text: "Shelf: 4 Back Room: 8" };
  }

  // The AR view associated with the tracked barcode should only be set again if it was changed,
  // to avoid unnecessarily recreating it.
  const didViewChange = JSON.stringify(viewContents[trackedBarcode.identifier]) != JSON.stringify(viewContent);
  if (didViewChange) {
    viewContents[trackedBarcode.identifier] = viewContent;
    setView(trackedBarcode);
  }
}

const setView = (trackedBarcode) => {
  const viewContent = viewContents[trackedBarcode.identifier];
  const shouldShowARView = viewContent !== null;

  if (shouldShowARView) {
    const bubble = Scandit.TrackedBarcodeView.withHTMLElement(
      createBubbleWithContent(viewContent),
      // To get the best possible AR view quality, it is suggested to set AR view sizes with taking into account
      // the device pixel ratio and scale them down based on it.
      { scale: 1 / window.devicePixelRatio },
    );
    window.advancedOverlay.setViewForTrackedBarcode(bubble, trackedBarcode).catch(console.warn);
  } else {
    window.advancedOverlay.setViewForTrackedBarcode(null, trackedBarcode).catch(console.warn);
  }
}

const createBubbleWithContent = (content) => {
  const bubbleWidth = 234;
  const bubbleHeight = 60;

  const container = document.createElement("div");
  container.style.width = `${bubbleWidth * window.devicePixelRatio}px`;
  container.style.height = `${bubbleHeight * window.devicePixelRatio}px`;
  container.style.borderRadius = `${(bubbleHeight / 2) * window.devicePixelRatio}px`;
  container.style.backgroundColor = "#fffc"
  container.style.display = "flex";
  container.style.fontFamily = "Helvetica Neue";
  container.style.fontSize = `${14 * window.devicePixelRatio}px`;

  const icon = document.createElement("div");
  icon.style.width = `${bubbleHeight * window.devicePixelRatio}px`;
  icon.style.height = `${bubbleHeight * window.devicePixelRatio}px`;
  icon.style.borderRadius = `${(bubbleHeight / 2) * window.devicePixelRatio}px`;
  icon.style.backgroundColor = "#5AD5C8CC";
  container.appendChild(icon);

  const textContainer = document.createElement("div");
  textContainer.style.width = `${(bubbleWidth - bubbleHeight) * window.devicePixelRatio}px`;
  textContainer.style.height = `${bubbleHeight * window.devicePixelRatio}px`;
  textContainer.style.display = "flex";
  textContainer.style.flexDirection = "column";
  textContainer.style.justifyContent = "center";
  textContainer.style.alignItems = "flex-start";
  textContainer.style.paddingLeft = `${7 * window.devicePixelRatio}px`;
  container.appendChild(textContainer);

  if (content.title) {
    const title = document.createElement("p");
    title.style.margin = "0";
    title.style.fontWeight = "bold";
    title.innerText = content.title;
    textContainer.appendChild(title);
  }

  if (content.text) {
    const text = document.createElement("p");
    text.style.margin = "0";
    text.innerText = content.text;
    textContainer.appendChild(text);
  }

  return container;
};
