const Mode = {
  Barcode: 'barcode',
  MRZ: 'mrz',
  VIZ: 'viz',
};

window.currentMode = () => document.querySelector('#modes .selected').attributes['sdc-mode'].value;

document.addEventListener('deviceready', () => {
  // Create data capture context using your license key.
  window.context = Scandit.DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  const camera = Scandit.Camera.withSettings(Scandit.IdCapture.recommendedCameraSettings);
  window.context.setFrameSource(camera);

  window.listener = {
    didCaptureId: (_, capturedId) => {
      window.showResult(window.getCapturedIdResult(capturedId));
    },
    didRejectId: (_, rejectedId, reason) => {
      window.showResult(window.getRejectionReasonMessage(reason));
    }
  };

  window.view = Scandit.DataCaptureView.forContext(window.context);

  window.view.connectToElement(document.getElementById('data-capture-view'));

  window.selectMode(document.querySelector('#modes .selected'));

  camera.switchToDesiredState(Scandit.FrameSourceState.On);
  window.idCapture.isEnabled = true;
}, false);

window.setupMode = mode => {
  const settings = new Scandit.IdCaptureSettings();
  settings.acceptedDocuments.push(
    new Scandit.IdCard(Scandit.IdCaptureRegion.Any),
    new Scandit.DriverLicense(Scandit.IdCaptureRegion.Any),
    new Scandit.Passport(Scandit.IdCaptureRegion.Any),
  );

  if (mode == Mode.MRZ) {
    settings.scannerType = new Scandit.SingleSideScanner(false, true, false);
  }

  if (mode == Mode.Barcode) {
    settings.scannerType = new Scandit.SingleSideScanner(true, false, false);
  }

  if (mode == Mode.VIZ) {
    settings.scannerType = new Scandit.SingleSideScanner(false, false, true);
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

window.showResult = (result) => {
  const shouldShowResult = result && (document.querySelector('#result').style.display === "none" || document.querySelector('#result').style.display === "");
  document.querySelector('#result').style.display = shouldShowResult ? "inherit" : "none";
  document.querySelector('#header .title').innerText = shouldShowResult ? "Scan Result" : "ID Extended";
  document.querySelector('#header .back').style.display = shouldShowResult ? "inherit" : "none";
  document.querySelector('#data-capture-view').style.display = shouldShowResult ? "none" : "inherit";
  window.idCapture.isEnabled = !shouldShowResult;


  document.querySelector('#result').innerHTML = result;
}

window.getCapturedIdResult = (capturedId) => {
  const getDateAsString = (dateObject) => {
    return `${(dateObject && new Date(Date.UTC(
      dateObject.year,
      dateObject.month - 1,
      dateObject.day
    )).toLocaleDateString("en-GB", { timeZone: "UTC" })) || "empty"}`
  }

  const f = value => {
    if (!value) {
      return "empty";
    } else if (value instanceof Scandit.DateResult) {
      return getDateAsString(value);
    } else if (value instanceof Array) {
      return value.map(f).join('<br>');
    } else {
      return value
    }
  }

  let result = '';

  result += `<p class="label">Full Name</p><p>${f(capturedId.fullName)}</p>`;
  result += `<p class="label">Date of Birth</p><p>${f(capturedId.dateOfBirth)}</p>`;
  result += `<p class="label">Date of Expiry</p><p>${f(capturedId.dateOfExpiry)}</p>`;
  result += `<p class="label">Document Number</p><p>${f(capturedId.documentNumber)}</p>`;
  result += `<p class="label">Nationality</p><p>${f(capturedId.nationality)}</p>`;

  if (capturedId.images.face) {
    result += `<p class="label">Face</p>`;
    result += `<img src="data:image/png;base64,${capturedId.images.face}" />`;
  }
  return result;
}

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

window.selectMode = (sourceNode) => {
  const mode = sourceNode.attributes['sdc-mode'].value;
  this.setupMode(mode);
  document.querySelectorAll('#modes > button').forEach(node => node.className = node == sourceNode ? 'selected' : '');
}
