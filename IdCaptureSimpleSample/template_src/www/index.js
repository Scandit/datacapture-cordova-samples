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

  // We are interested in the front side of national Id Cards and passports using MRZ.
  settings.supportedDocuments = [
    Scandit.IdDocumentType.IdCardVIZ,
    Scandit.IdDocumentType.AAMVABarcode,
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

      if (session.newlyCapturedId.mrzResult != null) {
        window.showResult(window.descriptionForMrzResult(session.newlyCapturedId));
      } else if (session.newlyCapturedId.vizResult != null) {
        window.showResult(window.descriptionForVizResult(session.newlyCapturedId));
      } else if (session.newlyCapturedId.aamvaBarcodeResult != null) {
        window.showResult(window.descriptionForUsDriverLicenseBarcodeResult(session.newlyCapturedId));
      } else if (session.newlyCapturedId.usUniformedServicesBarcodeResult != null) {
        window.showResult(window.descriptionForUsUniformedServicesBarcodeResult(session.newlyCapturedId));
      }
    },
    didFailWithError: (_, error, session) => {
      window.showResult(error.message);
    }
  });

  window.idCapture.isEnabled = true;

  window.idCaptureOverlay = Scandit.IdCaptureOverlay.withIdCaptureForView(window.idCapture, view);
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

window.descriptionForMrzResult = (result) => {
  return `
  ${descriptionForCapturedId(result)}<br><br>
  Document Code: ${result.mrzResult.documentCode}<br>
  Names Are Truncated: ${result.mrzResult.namesAreTruncated ? "Yes" : "No"}<br>
  Optional: ${result.mrzResult.optional || "empty"}<br>
  Optional 1: ${result.mrzResult.optional1 || "empty"}<br>
  `
}

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

window.descriptionForUsDriverLicenseBarcodeResult = (result) => {
  return `
  ${descriptionForCapturedId(result)}<br><br>
  AAMVA Version: ${result.aamvaBarcodeResult.aamvaVersion}<br>
  Jurisdiction Version: ${result.aamvaBarcodeResult.jurisdictionVersion}<br>
  IIN: ${result.aamvaBarcodeResult.iIN}<br>
  Issuing Jurisdiction: ${result.aamvaBarcodeResult.issuingJurisdiction}<br>
  Issuing Jurisdiction ISO: ${result.aamvaBarcodeResult.issuingJurisdictionISO}<br>
  Eye Color: ${result.aamvaBarcodeResult.eyeColor || "empty"}<br>
  Hair Color: ${result.aamvaBarcodeResult.hairColor || "empty"}<br>
  Height Inch: ${result.aamvaBarcodeResult.heightInch || 0}<br>
  Height Cm: ${result.aamvaBarcodeResult.heightCm || 0}<br>
  Weight Lb: ${result.aamvaBarcodeResult.weightLbs || 0}<br>
  Weight Kg: ${result.aamvaBarcodeResult.weightKg || 0}<br>
  Place of Birth: ${result.aamvaBarcodeResult.placeOfBirth || "empty"}<br>
  Race: ${result.aamvaBarcodeResult.race || "empty"}<br>
  Document Discriminator Number: ${result.aamvaBarcodeResult.documentDiscriminatorNumber || "empty"}<br>
  Vehicle Class: ${result.aamvaBarcodeResult.vehicleClass || "empty"}<br>
  Restrictions Code: ${result.aamvaBarcodeResult.restrictionsCode || "empty"}<br>
  Endorsements Code: ${result.aamvaBarcodeResult.endorsementsCode || "empty"}<br>
  Card Revision Date: ${JSON.stringify(result.aamvaBarcodeResult.cardRevisionDate.date) || "empty"}<br>
  Middle Name: ${result.aamvaBarcodeResult.middleName || "empty"}<br>
  Driver Name Suffix: ${result.aamvaBarcodeResult.driverNameSuffix || "empty"}<br>
  Driver Name Prefix: ${result.aamvaBarcodeResult.driverNamePrefix || "empty"}<br>
  Last Name Truncation: ${result.aamvaBarcodeResult.lastNameTruncation || "empty"}<br>
  First Name Truncation: ${result.aamvaBarcodeResult.firstNameTruncation || "empty"}<br>
  Middle Name Truncation: ${result.aamvaBarcodeResult.middleNameTruncation || "empty"}<br>
  Alias Family Name: ${result.aamvaBarcodeResult.aliasFamilyName || "empty"}<br>
  Alias Given Name: ${result.aamvaBarcodeResult.aliasGivenName || "empty"}<br>
  Alias Suffix Name: ${result.aamvaBarcodeResult.aliasSuffixName || "empty"}<br>
  `
}

window.descriptionForUsUniformedServicesBarcodeResult = (result) => {
  return `
  ${descriptionForCapturedId(result)}<br><br>
  Version: ${result.usUniformedServicesBarcodeResult.version}<br>
  Sponsor Flag: ${result.usUniformedServicesBarcodeResult.sponsorFlag}<br>
  Person Designator Document: ${result.usUniformedServicesBarcodeResult.personDesignatorDocument}<br>
  Family Sequence Number: ${result.usUniformedServicesBarcodeResult.familySequenceNumber}<br>
  Deers Dependent Suffix Code: ${result.usUniformedServicesBarcodeResult.deersDependentSuffixCode}<br>
  Deers Dependent Suffix Description: ${result.usUniformedServicesBarcodeResult.deersDependentSuffixDescription}<br>
  Height: ${result.usUniformedServicesBarcodeResult.height}<br>
  Weight: ${result.usUniformedServicesBarcodeResult.weight}<br>
  Hair Color: ${result.usUniformedServicesBarcodeResult.hairColor}<br>
  Eye Color: ${result.usUniformedServicesBarcodeResult.eyeColor}<br>
  Direct Care Flag Code: ${result.usUniformedServicesBarcodeResult.directCareFlagCode}<br>
  Direct Care Flag Description: ${result.usUniformedServicesBarcodeResult.directCareFlagDescription}<br>
  Civilian Health Care Flag Code: ${result.usUniformedServicesBarcodeResult.civilianHealthCareFlagCode}<br>
  Civilian Health Care Flag Description: ${result.usUniformedServicesBarcodeResult.civilianHealthCareFlagDescription}<br>
  Commissary Flag Code: ${result.usUniformedServicesBarcodeResult.commissaryFlagCode}<br>
  Commissary Flag Description: ${result.usUniformedServicesBarcodeResult.commissaryFlagDescription}<br>
  MWR Flag Code: ${result.usUniformedServicesBarcodeResult.mwrFlagCode}<br>
  MWR Flag Description: ${result.usUniformedServicesBarcodeResult.mwrFlagDescription}<br>
  Exchange Flag Code: ${result.usUniformedServicesBarcodeResult.exchangeFlagCode}<br>
  Exchange Flag Description: ${result.usUniformedServicesBarcodeResult.exchangeFlagDescription}<br>
  Champus Effective Date: ${JSON.stringify(result.usUniformedServicesBarcodeResult.champusEffectiveDate.date) || "empty"}<br>
  Champus Expiry Date: ${JSON.stringify(result.usUniformedServicesBarcodeResult.champusExpiryDate.date) || "empty"}<br>
  Form Number: ${result.usUniformedServicesBarcodeResult.formNumber}<br>
  Security Code: ${result.usUniformedServicesBarcodeResult.securityCode}<br>
  Service Code: ${result.usUniformedServicesBarcodeResult.serviceCode}<br>
  Status Code: ${result.usUniformedServicesBarcodeResult.statusCode}<br>
  Status Code Description: ${result.usUniformedServicesBarcodeResult.statusCodeDescription}<br>
  Branch Of Service: ${result.usUniformedServicesBarcodeResult.branchOfService}<br>
  Rank: ${result.usUniformedServicesBarcodeResult.rank}<br>
  Pay Grade: ${result.usUniformedServicesBarcodeResult.payGrade}<br>
  Sponsor Name: ${result.usUniformedServicesBarcodeResult.sponsorName || "empty"}<br>
  Sponsor Person Designator Identifier: ${result.usUniformedServicesBarcodeResult.sponsorPersonDesignatorIdentifier || 0}<br>
  Relationship Code: ${result.usUniformedServicesBarcodeResult.relationshipCode || "empty"}<br>
  Relationship Description: ${result.usUniformedServicesBarcodeResult.relationshipDescription || "empty"}<br>
  Geneva Convention Category: ${result.usUniformedServicesBarcodeResult.genevaConventionCategory || "empty"}<br>
  Blood Type: ${result.usUniformedServicesBarcodeResult.bloodType || "empty"}<br>
  `
}

window.descriptionForCapturedId = (result) => {
  return `
  Name: ${result.firstName || "empty"}<br>
  Last Name: ${result.lastName || "empty"}<br>
  Full Name: ${result.fullName}<br>
  Sex: ${result.sex || "empty"}<br>
  Date of Birth: ${JSON.stringify(result.dateOfBirth && result.dateOfBirth.date) || "empty"}<br>
  Nationality: ${result.nationality || "empty"}<br>
  Address: ${result.address || "empty"}<br>
  Document Type: ${result.documentType}<br>
  Captured Result Type: ${result.capturedResultType}<br>
  Issuing Country: ${result.issuingCountry || "empty"}<br>
  Issuing Country ISO: ${result.issuingCountryISO || "empty"}<br>
  Document Number: ${result.documentNumber || "empty"}<br>
  Date of Expiry: ${JSON.stringify(result.dateOfExpiry && result.dateOfExpiry.date) || "empty"}<br>
  Date of Issue: ${JSON.stringify(result.dateOfIssue && result.dateOfIssue.date) || "empty"}<br>
  `
}