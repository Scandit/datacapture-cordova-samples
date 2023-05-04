document.addEventListener('deviceready', () => {
  // Create data capture context using your license key.
  const context = Scandit.DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
  // default and must be turned on to start streaming frames to the data capture context for recognition.
  const camera = Scandit.Camera.default;
  context.setFrameSource(camera);

  // Use the recommended camera settings for the IdCapture mode.
  camera.applySettings(Scandit.IdCapture.recommendedCameraSettings);

  // The ID capturing process is configured through ID capture settings
  // and are then applied to the ID capture instance that manages id recognition.
  const settings = new Scandit.IdCaptureSettings();

  // We are interested in the front side of national Id Cards.
  settings.supportedDocuments = [
    Scandit.IdDocumentType.IdCardVIZ,
    Scandit.IdDocumentType.DLVIZ,
  ]

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
    didCaptureId: (_, session) => {
      if (session.newlyCapturedId == null) {
        return
      }

      window.idCapture.isEnabled = false;

      if (session.newlyCapturedId.vizResult != null) {
        window.showResult(window.descriptionForVizResult(session.newlyCapturedId));
      }  else {
        window.showResult(window.descriptionForCapturedId(session.newlyCapturedId));
      }
    },
    didFailWithError: (_, error, session) => {
      window.showResult(error.message);
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

window.descriptionForVizResult = (result) => {
  return `
  ${descriptionForCapturedId(result)}<br><br>
  Additional Name Information: ${result.vizResult.additionalNameInformation || "empty"}<br>
  Additional Address Information: ${result.vizResult.additionalAddressInformation || "empty"}<br>
  Place of Birth: ${result.vizResult.placeOfBirth || "empty"}<br>
  Race: ${result.vizResult.race || "empty"}<br>
  Religion: ${result.vizResult.religion || "empty"}<br>
  Profession: ${result.vizResult.profession || "empty"}<br>
  Marital Status: ${result.vizResult.maritalStatus || "empty"}<br>
  Residential Status: ${result.vizResult.residentialStatus || "empty"}<br>
  Employer: ${result.vizResult.employer || "empty"}<br>
  Personal Id Number: ${result.vizResult.personalIdNumber || "empty"}<br>
  Document Additional Number: ${result.vizResult.documentAdditionalNumber || "empty"}<br>
  Issuing Jurisdiction: ${result.vizResult.issuingJurisdiction || "empty"}<br>
  Issuing Authority: ${result.vizResult.issuingAuthority || "empty"}<br>
  `
}

window.descriptionForCapturedId = (result) => {
  return `
  Name: ${result.firstName || "empty"}<br>
  Last Name: ${result.lastName || "empty"}<br>
  Full Name: ${result.fullName}<br>
  Sex: ${result.sex || "empty"}<br>
  Date of Birth: ${result.dateOfBirth && new Date(result.dateOfBirth.year, result.dateOfBirth.month, result.dateOfBirth.day).toLocaleDateString() || "empty"}<br>
  Nationality: ${result.nationality || "empty"}<br>
  Address: ${result.address || "empty"}<br>
  Document Type: ${result.documentType}<br>
  Captured Result Type: ${result.capturedResultType}<br>
  Issuing Country: ${result.issuingCountry || "empty"}<br>
  Issuing Country ISO: ${result.issuingCountryIso || "empty"}<br>
  Document Number: ${result.documentNumber || "empty"}<br>
  Date of Expiry: ${result.dateOfExpiry && new Date(result.dateOfExpiry.year, result.dateOfExpiry.month, result.dateOfExpiry.day).toLocaleDateString() || "empty"}<br>
  Date of Issue: ${result.dateOfIssue && new Date(result.dateOfIssue.year, result.dateOfIssue.month, result.dateOfIssue.day).toLocaleDateString() || "empty"}<br>
  `
}
