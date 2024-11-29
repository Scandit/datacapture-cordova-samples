document.addEventListener('deviceready', () => {
  // Create data capture context using your license key.
  const context = Scandit.DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  // Use the recommended camera settings for the IdCapture mode.
  const camera = Scandit.Camera.withSettings(Scandit.IdCapture.recommendedCameraSettings);
  context.setFrameSource(camera);

  // The ID capturing process is configured through ID capture settings
  // and are then applied to the ID capture instance that manages id recognition.
  const settings = new Scandit.IdCaptureSettings();

  // Recognize national ID cards, driver's licenses and passports.
  settings.acceptedDocuments.push(
    new Scandit.IdCard(Scandit.IdCaptureRegion.Any),
    new Scandit.DriverLicense(Scandit.IdCaptureRegion.Any),
    new Scandit.Passport(Scandit.IdCaptureRegion.Any),
  );
  settings.scannerType = new Scandit.FullDocumentScanner();

  // To visualize the on-going id capturing process on screen, setup a data capture view that renders the
  // camera preview. The view must be connected to the data capture context.
  const view = Scandit.DataCaptureView.forContext(context);

  // Connect the data capture view to the HTML element, so it can fill up its size and follow its position.
  view.connectToElement(document.getElementById('data-capture-view'));

  // Switch camera on to start streaming frames and enable the id capture mode.
  // The camera is started asynchronously and will take some time to completely turn on.
  camera.switchToDesiredState(Scandit.FrameSourceState.On);

  // Create new id capture mode with the settings from above.
  window.idCapture = Scandit.IdCapture.forContext(context, settings);

  // Register a listener to get informed whenever a new id got recognized.
  window.idCapture.addListener({
    didCaptureId: (_, capturedId) => {
      window.idCapture.isEnabled = false;

      window.showResult(window.descriptionForCapturedId(capturedId));
    },
    didRejectId: (_, rejectedId, reason) => {
      window.idCapture.isEnabled = false;
      
      window.showResult(window.getRejectionReasonMessage(reason));
    }
  });

  window.idCaptureOverlay = Scandit.IdCaptureOverlay.withIdCaptureForView(window.idCapture, view);
  window.idCaptureOverlay.idLayoutStyle = Scandit.IdLayoutStyle.Square;

  window.idCapture.isEnabled = true;
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
  window.idCapture.isEnabled = true;
}

// === //

window.getRejectionReasonMessage = (reason) => {
  switch (reason) {
      case Scandit.RejectionReason.NotAcceptedDocumentType:
          return 'Document not supported. Try scanning another document.';
      case Scandit.RejectionReason.Timeout:
          return 'Document capture failed. Make sure the document is well lit and free of glare. Alternatively, try scanning another document';
      default:
          return `Document capture was rejected. Reason=${reason}`;
  }
}

window.descriptionForCapturedId = (result) => {
  function getDateAsString(dateObject) {
    return `${(dateObject && new Date(Date.UTC(
      dateObject.year,
      dateObject.month - 1,
      dateObject.day
    )).toLocaleDateString("en-GB", { timeZone: "UTC" })) || "empty"}`
  }

  return `
  Full Name: ${result.fullName}<br>
  Date of Birth: ${getDateAsString(result.dateOfBirth)}<br>
  Date of Expiry: ${getDateAsString(result.dateOfExpiry)}<br>
  Document Number: ${result.documentNumber || "empty"}<br>
  Nationality: ${result.nationality || "empty"}<br>
  `
}
