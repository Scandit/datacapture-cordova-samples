const Mode = {
  Barcode: 'barcode',
  MRZ: 'mrz',
  VIZ: 'viz',
};

window.currentMode = () => document.querySelector('#modes .selected').attributes['sdc-mode'].value;

document.addEventListener('deviceready', () => {
  window.context = Scandit.DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  const camera = Scandit.Camera.default;
  camera.applySettings(Scandit.IdCapture.recommendedCameraSettings);
  window.context.setFrameSource(camera);

  window.listener = {
    didCaptureId: (_, session) => {
      window.capturedId = session.newlyCapturedId;
      if (!window.capturedId) return;

      if (!window.capturedId.capturedResultTypes.includes(Scandit.CapturedResultType.VIZResult) ||
       window.capturedId.vizResult.capturedSides != Scandit.SupportedSides.FrontOnly ||
       window.capturedId.vizResult.isBackSideCaptureSupported == false) {
        window.idCapture.isEnabled = false;
        window.showResult();
      }
    }
  };

  window.view = Scandit.DataCaptureView.forContext(window.context);

  window.view.connectToElement(document.getElementById('data-capture-view'));

  window.selectMode(document.querySelector('#modes .selected'));

  camera.switchToDesiredState(Scandit.FrameSourceState.On);
  window.idCapture.isEnabled = true;
}, false);

window.setupMode = mode => {
  const supportedDocuments = {};
  supportedDocuments[Mode.Barcode] = [
    Scandit.IdDocumentType.AAMVABarcode,
    Scandit.IdDocumentType.ColombiaIdBarcode,
    Scandit.IdDocumentType.USUSIdBarcode,
    Scandit.IdDocumentType.ArgentinaIdBarcode,
    Scandit.IdDocumentType.SouthAfricaDlBarcode,
    Scandit.IdDocumentType.SouthAfricaIdBarcode,
  ];
  supportedDocuments[Mode.MRZ] = [
    Scandit.IdDocumentType.VisaMRZ,
    Scandit.IdDocumentType.PassportMRZ,
    Scandit.IdDocumentType.SwissDLMRZ,
    Scandit.IdDocumentType.IdCardMRZ,
  ];
  supportedDocuments[Mode.VIZ] = [
    Scandit.IdDocumentType.DLVIZ,
    Scandit.IdDocumentType.IdCardVIZ,
  ];

  const settings = new Scandit.IdCaptureSettings();

  settings.supportedDocuments = supportedDocuments[mode];

  if (mode == Mode.VIZ) {
    settings.supportedSides = Scandit.SupportedSides.FrontAndBack;
    settings.setShouldPassImageTypeToResult(Scandit.IdImageType.Face, true);
  }

  window.context.removeMode(window.idCapture);
  if (window.overlay) {
    window.view.removeOverlay(window.overlay);
  }
  window.idCapture = Scandit.IdCapture.forContext(window.context, settings);
  window.idCapture.addListener(window.listener);
  window.overlay = Scandit.IdCaptureOverlay.withIdCaptureForView(window.idCapture, window.view);
}

window.showResult = () => {
  if (!window.capturedId) {
    window.idCapture.isEnabled = true;
    return;
  }

  const shouldShowResult = window.capturedId && (document.querySelector('#result').style.display === "none" || document.querySelector('#result').style.display === "");
  document.querySelector('#result').style.display = shouldShowResult ? "inherit" : "none";
  document.querySelector('#header .title').innerText = shouldShowResult ? "Scan Result" : "ID Extended";
  document.querySelector('#header .back').style.display = shouldShowResult ? "inherit" : "none";
  document.querySelector('#data-capture-view').style.display = shouldShowResult ? "none" : "inherit";
  window.idCapture.isEnabled = !shouldShowResult;

  const getDateAsString = (dateObject) => {
    return `${(dateObject && new Date(Date.UTC(
        dateObject.year,
        dateObject.month - 1,
        dateObject.day
    )).toLocaleDateString("en-GB", {timeZone: "UTC"})) || "empty"}`
  }

  const f = value => {
    if (!value) {
      return "empty";
    } else if (value instanceof Scandit.DateResult) {
      return getDateAsString(value);
    } else if (value instanceof Scandit.ProfessionalDrivingPermit) {
      return `<div>
          <p class="label">Codes</p><p>${f(value.codes)}</p>
          <p class="label">Date of Expiry</p><p>${f(value.dateOfExpiry)}</p>
        </div>`;
    } else if (value instanceof Scandit.VehicleRestriction) {
      return `<div>
          <p class="label">Vehicle Code</p><p>${f(value.vehicleCode)}</p>
          <p class="label">Vehicle Restriction</p><p>${f(value.vehicleRestriction)}</p>
          <p class="label">Date of Issue</p><p>${f(value.dateOfIssue)}</p>
        </div>`;
    } else if (value instanceof Array) {
      return value.map(f).join('<br>');
    } else {
      return value
    }
  }

  let result = '';

  result += `<p class="label">First Name</p><p>${f(window.capturedId.firstName)}</p>`;
  result += `<p class="label">Last Name</p><p>${f(window.capturedId.lastName)}</p>`;
  result += `<p class="label">Full Name</p><p>${f(window.capturedId.fullName)}</p>`;
  result += `<p class="label">Sex</p><p>${f(window.capturedId.sex)}</p>`;
  result += `<p class="label">Date of Birth</p><p>${f(window.capturedId.dateOfBirth)}</p>`;
  result += `<p class="label">Nationality</p><p>${f(window.capturedId.nationality)}</p>`;
  result += `<p class="label">Address</p><p>${f(window.capturedId.address)}</p>`;
  result += `<p class="label">Captured Result Type</p><p>${f(window.capturedId.capturedResultType)}</p>`;
  result += `<p class="label">Document Type</p><p>${f(window.capturedId.documentType)}</p>`;
  result += `<p class="label">Issuing Country ISO</p><p>${f(window.capturedId.issuingCountryIso)}</p>`;
  result += `<p class="label">Issuing Country</p><p>${f(window.capturedId.issuingCountry)}</p>`;
  result += `<p class="label">Document Number</p><p>${f(window.capturedId.documentNumber)}</p>`;
  result += `<p class="label">Date of Expiry</p><p>${f(window.capturedId.dateOfExpiry)}</p>`;
  result += `<p class="label">Date of Issue</p><p>${f(window.capturedId.dateOfIssue)}</p>`;

  if (window.capturedId.idImageOfType(Scandit.IdImageType.Face)) {
    result += `<p class="label">Face</p>`;
    result += `<img src="data:image/png;base64,${window.capturedId.idImageOfType(Scandit.IdImageType.Face)}" />`;
  }

  if (window.capturedId.aamvaBarcodeResult) {
    result += `<p class="label">AAMVA Version</p><p>${f(window.capturedId.aamvaBarcodeResult.aamvaVersion)}</p>`;
    result += `<p class="label">Alias Family Name</p><p>${f(window.capturedId.aamvaBarcodeResult.aliasFamilyName)}</p>`;
    result += `<p class="label">Alias Given Name</p><p>${f(window.capturedId.aamvaBarcodeResult.aliasGivenName)}</p>`;
    result += `<p class="label">Alias Suffix Name</p><p>${f(window.capturedId.aamvaBarcodeResult.aliasSuffixName)}</p>`;
    result += `<p class="label">Driver Name Prefix</p><p>${f(window.capturedId.aamvaBarcodeResult.driverNamePrefix)}</p>`;
    result += `<p class="label">Driver Name Suffix</p><p>${f(window.capturedId.aamvaBarcodeResult.driverNameSuffix)}</p>`;
    result += `<p class="label">Endorsements Code</p><p>${f(window.capturedId.aamvaBarcodeResult.endorsementsCode)}</p>`;
    result += `<p class="label">Eye Color</p><p>${f(window.capturedId.aamvaBarcodeResult.eyeColor)}</p>`;
    result += `<p class="label">First Name Truncation</p><p>${f(window.capturedId.aamvaBarcodeResult.firstNameTruncation)}</p>`;
    result += `<p class="label">Hair Color</p><p>${f(window.capturedId.aamvaBarcodeResult.hairColor)}</p>`;
    result += `<p class="label">Height CM</p><p>${f(window.capturedId.aamvaBarcodeResult.heightCm)}</p>`;
    result += `<p class="label">Height Inch</p><p>${f(window.capturedId.aamvaBarcodeResult.heightInch)}</p>`;
    result += `<p class="label">I In</p><p>${f(window.capturedId.aamvaBarcodeResult.iIN)}</p>`;
    result += `<p class="label">Issuing Jurisdiction</p><p>${f(window.capturedId.aamvaBarcodeResult.issuingJurisdiction)}</p>`;
    result += `<p class="label">Issuing Jurisdiction ISO</p><p>${f(window.capturedId.aamvaBarcodeResult.issuingJurisdictionIso)}</p>`;
    result += `<p class="label">Jurisdiction Version</p><p>${f(window.capturedId.aamvaBarcodeResult.jurisdictionVersion)}</p>`;
    result += `<p class="label">Last Name Truncation</p><p>${f(window.capturedId.aamvaBarcodeResult.lastNameTruncation)}</p>`;
    result += `<p class="label">Middle Name</p><p>${f(window.capturedId.aamvaBarcodeResult.middleName)}</p>`;
    result += `<p class="label">Middle Name Truncation</p><p>${f(window.capturedId.aamvaBarcodeResult.middleNameTruncation)}</p>`;
    result += `<p class="label">Place Of Birth</p><p>${f(window.capturedId.aamvaBarcodeResult.placeOfBirth)}</p>`;
    result += `<p class="label">Race</p><p>${f(window.capturedId.aamvaBarcodeResult.race)}</p>`;
    result += `<p class="label">Restrictions Code</p><p>${f(window.capturedId.aamvaBarcodeResult.restrictionsCode)}</p>`;
    result += `<p class="label">Vehicle Class</p><p>${f(window.capturedId.aamvaBarcodeResult.vehicleClass)}</p>`;
    result += `<p class="label">Weight Kg</p><p>${f(window.capturedId.aamvaBarcodeResult.weightKg)}</p>`;
    result += `<p class="label">Weight Lbs</p><p>${f(window.capturedId.aamvaBarcodeResult.weightLbs)}</p>`;
    result += `<p class="label">Card Revision Date</p><p>${f(window.capturedId.aamvaBarcodeResult.cardRevisionDate)}</p>`;
    result += `<p class="label">Document Discriminator Number</p><p>${f(window.capturedId.aamvaBarcodeResult.documentDiscriminatorNumber)}</p>`;
    result += `<p class="label">Barcode Data Elements</p><p>${f(window.capturedId.aamvaBarcodeResult.barcodeDataElements)}</p>`;
  }

  if (window.capturedId.argentinaIdBarcodeResult) {
    result += `<p class="label">Personal Id Number</p><p>${f(window.capturedId.argentinaIdBarcodeResult.personalIdNumber)}</p>`;
    result += `<p class="label">Document Copy</p><p>${f(window.capturedId.argentinaIdBarcodeResult.documentCopy)}</p>`;
  }

  if (window.capturedId.colombiaIdBarcodeResult) {
    result += `<p class="label">Blood Type</p><p>${f(window.capturedId.colombiaIdBarcodeResult.bloodType)}</p>`;
  }

  if (window.capturedId.mrzResult) {
    result += `<p class="label">Document Code</p><p>${f(window.capturedId.mrzResult.documentCode)}</p>`;
    result += `<p class="label">Names Are Truncated</p><p>${f(window.capturedId.mrzResult.namesAreTruncated)}</p>`;
    result += `<p class="label">Optional</p><p>${f(window.capturedId.mrzResult.optional)}</p>`;
    result += `<p class="label">Optional1</p><p>${f(window.capturedId.mrzResult.optional1)}</p>`;
    result += `<p class="label">Captured Mrz</p><p>${f(window.capturedId.mrzResult.capturedMrz)}</p>`;
  }

  if (window.capturedId.southAfricaIdBarcodeResult) {
    result += `<p class="label">Country Of Birth</p><p>${f(window.capturedId.southAfricaIdBarcodeResult.countryOfBirth)}</p>`;
    result += `<p class="label">Country Of Birth Iso</p><p>${f(window.capturedId.southAfricaIdBarcodeResult.countryOfBirthIso)}</p>`;
    result += `<p class="label">Citizenship Status</p><p>${f(window.capturedId.southAfricaIdBarcodeResult.citizenshipStatus)}</p>`;
    result += `<p class="label">Personal Id Number</p><p>${f(window.capturedId.southAfricaIdBarcodeResult.personalIdNumber)}</p>`;
  }

  if (window.capturedId.southAfricaDlBarcodeResult) {
    result += `<p class="label">Version</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.version)}</p>`;
    result += `<p class="label">License Country Of Issue</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.licenseCountryOfIssue)}</p>`;
    result += `<p class="label">Personal Id Number</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.personalIdNumber)}</p>`;
    result += `<p class="label">Personal Id Number Type</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.personalIdNumberType)}</p>`;
    result += `<p class="label">Document Copy</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.documentCopy)}</p>`;
    result += `<p class="label">Driver Restriction Codes</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.driverRestrictionCodes)}</p>`;
    result += `<p class="label">Professional Driving Permit</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.professionalDrivingPermit)}</p>`;
    result += `<p class="label">Vehicle Restrictions</p><p>${f(window.capturedId.southAfricaDlBarcodeResult.vehicleRestrictions)}</p>`;
  }

  if (window.capturedId.usUniformedServicesBarcodeResult) {
    result += `<p class="label">Blood Type</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.bloodType)}</p>`;
    result += `<p class="label">Branch Of Service</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.branchOfService)}</p>`;
    result += `<p class="label">Champus Effective Date</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.champusEffectiveDate)}</p>`;
    result += `<p class="label">Champus Expiry Date</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.champusExpiryDate)}</p>`;
    result += `<p class="label">Civilian Health Care Flag Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.civilianHealthCareFlagCode)}</p>`;
    result += `<p class="label">Civilian Health Care Flag Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.civilianHealthCareFlagDescription)}</p>`;
    result += `<p class="label">Commissary Flag Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.commissaryFlagCode)}</p>`;
    result += `<p class="label">Commissary Flag Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.commissaryFlagDescription)}</p>`;
    result += `<p class="label">Deers Dependent Suffix Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.deersDependentSuffixCode)}</p>`;
    result += `<p class="label">Deers Dependent Suffix Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.deersDependentSuffixDescription)}</p>`;
    result += `<p class="label">Direct Care Flag Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.directCareFlagCode)}</p>`;
    result += `<p class="label">Direct Care Flag Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.directCareFlagDescription)}</p>`;
    result += `<p class="label">Exchange Flag Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.exchangeFlagCode)}</p>`;
    result += `<p class="label">Exchange Flag Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.exchangeFlagDescription)}</p>`;
    result += `<p class="label">Eye Color</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.eyeColor)}</p>`;
    result += `<p class="label">Family Sequence Number</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.familySequenceNumber)}</p>`;
    result += `<p class="label">Form Number</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.formNumber)}</p>`;
    result += `<p class="label">Geneva Convention Category</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.genevaConventionCategory)}</p>`;
    result += `<p class="label">Hair Color</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.hairColor)}</p>`;
    result += `<p class="label">Height</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.height)}</p>`;
    result += `<p class="label">Jpeg Data</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.jpegData)}</p>`;
    result += `<p class="label">Mwr Flag Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.mwrFlagCode)}</p>`;
    result += `<p class="label">Mwr Flag Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.mwrFlagDescription)}</p>`;
    result += `<p class="label">Pay Grade</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.payGrade)}</p>`;
    result += `<p class="label">Person Designator Document</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.personDesignatorDocument)}</p>`;
    result += `<p class="label">Rank</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.rank)}</p>`;
    result += `<p class="label">Relationship Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.relationshipCode)}</p>`;
    result += `<p class="label">Relationship Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.relationshipDescription)}</p>`;
    result += `<p class="label">Security Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.securityCode)}</p>`;
    result += `<p class="label">Service Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.serviceCode)}</p>`;
    result += `<p class="label">Sponsor Flag</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.sponsorFlag)}</p>`;
    result += `<p class="label">Sponsor Name</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.sponsorName)}</p>`;
    result += `<p class="label">Sponsor Person Designator Identifier</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.sponsorPersonDesignatorIdentifier)}</p>`;
    result += `<p class="label">Status Code</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.statusCode)}</p>`;
    result += `<p class="label">Status Code Description</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.statusCodeDescription)}</p>`;
    result += `<p class="label">Version</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.version)}</p>`;
    result += `<p class="label">Weight</p><p>${f(window.capturedId.usUniformedServicesBarcodeResult.weight)}</p>`;
  }

  if (window.capturedId.vizResult) {
    result += `<p class="label">Additional Address Information</p><p>${f(window.capturedId.vizResult.additionalAddressInformation)}</p>`;
    result += `<p class="label">Additional Name Information</p><p>${f(window.capturedId.vizResult.additionalNameInformation)}</p>`;
    result += `<p class="label">Document Additional Number</p><p>${f(window.capturedId.vizResult.documentAdditionalNumber)}</p>`;
    result += `<p class="label">Employer</p><p>${f(window.capturedId.vizResult.employer)}</p>`;
    result += `<p class="label">Issuing Authority</p><p>${f(window.capturedId.vizResult.issuingAuthority)}</p>`;
    result += `<p class="label">Issuing Jurisdiction</p><p>${f(window.capturedId.vizResult.issuingJurisdiction)}</p>`;
    result += `<p class="label">Marital Status</p><p>${f(window.capturedId.vizResult.maritalStatus)}</p>`;
    result += `<p class="label">Personal Id Number</p><p>${f(window.capturedId.vizResult.personalIdNumber)}</p>`;
    result += `<p class="label">Place Of Birth</p><p>${f(window.capturedId.vizResult.placeOfBirth)}</p>`;
    result += `<p class="label">Profession</p><p>${f(window.capturedId.vizResult.profession)}</p>`;
    result += `<p class="label">Race</p><p>${f(window.capturedId.vizResult.race)}</p>`;
    result += `<p class="label">Religion</p><p>${f(window.capturedId.vizResult.religion)}</p>`;
    result += `<p class="label">Residential Status</p><p>${f(window.capturedId.vizResult.residentialStatus)}</p>`;
    result += `<p class="label">Captured Sides</p><p>${f(window.capturedId.vizResult.capturedSides)}</p>`;
    result += `<p class="label">Is Back Side Capture Supported</p><p>${f(window.capturedId.vizResult.isBackSideCaptureSupported)}</p>`;
  }

  document.querySelector('#result').innerHTML = result;
}

window.selectMode = (sourceNode) => {
  const mode = sourceNode.attributes['sdc-mode'].value;
  this.setupMode(mode);
  document.querySelectorAll('#modes > button').forEach(node => node.className = node == sourceNode ? 'selected' : '');
}