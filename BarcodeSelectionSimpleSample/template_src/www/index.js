document.addEventListener('deviceready', () => {
  // There is a Scandit sample license key set below here.
  // This license key is enabled for sample evaluation only.
  // If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
  const context = Scandit.DataCaptureContext.forLicenseKey('AWHjFzlFHa+fLq/kfS8GCBU/hT60NkQeVGQOWhhtRVcDZxJfsD0OY9NK0YErLuxTtTKLC1BLdrvDdsJ1dnxmcx9fDIeeaQlxawtkiq1pmEFxHOvYa3emcbAfOeiwbFPtQEWCWvdc95KoIFxAuDiYcfccdywzH2KONgwmnV9cEcX11FhIPLtX74RLua7VkOukFfNTOGExxhiCq96qZnzGgrgViuagpL0ekK6xv8K4bYt7lVkxloUMM6dFRSZ4aummJ2Q1uZNR78kSGCpCn/uJjaf/5lyNbYWpnxYvsYRPI7jOFYZykI0nIjhjt/ncukCEsz4BQLAh5hp1qocvQ2+dw3ADD8LJLXcnX7JaCOKV5cfHEHGSLR4moTxNtxPXdUNlM5w75iHZub5BsIfkJCknKrLn5oJ15k5Rx4/JnFj11tGLqtfRs+jdtXSGxAb86BxwPM1mEBO/Va1yV//CGku5UWR5MwspCf7pl8OUH7frkCtV4kDB6y5jusSMSIEGnKCLd2sWKE04mAURrpWt8pgsIB89xXPPTgPh1C+nAeMuuEN3dPYAJYrJKvy44w130JrUvxWLcTM1oFVWikC6CluLC7WGgRhZCew0eROnv9neITolB6Gmy04dlF0euA595dJcw2lLTwwxEydGp5gGIIDtofviho7JdHtPrMer/Ptz1/LOVeF55OY9eg8z1Lq2CkZf6cgWZBPa1uakuZzxWXZUprJMdTquhInmqP4ELLxGXhv+CXoT2n0p022+wyiWAXatmhvcK+n2uCWX30SL0Sri1qPmf6Ldtgqj2aFEMLM+LouJg6Ukv0PKUTXlgPW7L0vYrNGtPjvRlaR7Nwph');

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
