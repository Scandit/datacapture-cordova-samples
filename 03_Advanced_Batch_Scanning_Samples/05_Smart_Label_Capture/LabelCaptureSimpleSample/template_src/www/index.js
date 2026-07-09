let labelCapture;

document.addEventListener(
  'deviceready',
  () => {
    // There is a Scandit sample license key set below here.
    // This license key is enabled for sample evaluation only.
    // If you want to build your own application, get your license key by signing up for a trial at https://ssl.scandit.com/dashboard/sign-up?p=test
    const context = Scandit.DataCaptureContext.initialize('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

    // Set the camera as the frame source using recommended settings for label capture.
    const cameraSettings = Scandit.LabelCapture.createRecommendedCameraSettings();
    const camera = Scandit.Camera.default;
    camera.applySettings(cameraSettings);
    context.setFrameSource(camera);

    // Define a barcode field (required): accepts EAN-13/UPCA, GS1 Databar Expanded, and Code 128.
    const customBarcode = Scandit.CustomBarcode.initWithNameAndSymbologies('Barcode', [
      Scandit.Symbology.EAN13UPCA,
      Scandit.Symbology.GS1DatabarExpanded,
      Scandit.Symbology.Code128,
    ]);
    customBarcode.optional = false;

    // Define an expiry date field (required) in month/day/year format.
    const expiryDate = new Scandit.ExpiryDateText('Expiry Date');
    expiryDate.optional = false;
    expiryDate.labelDateFormat = new Scandit.LabelDateFormat(Scandit.LabelDateComponentFormat.MDY, false);

    // Define a total price field (optional).
    const totalPrice = new Scandit.TotalPriceText('Total Price');
    totalPrice.optional = true;

    const labelDefinition = new Scandit.LabelDefinition('Label');
    labelDefinition.fields = [customBarcode, expiryDate, totalPrice];

    // Create label capture settings with the defined label structure.
    const settings = Scandit.LabelCaptureSettings.settingsFromLabelDefinitions([labelDefinition], {});

    // Create the label capture mode and attach it to the context.
    labelCapture = new Scandit.LabelCapture(settings);
    context.setMode(labelCapture);

    // Create the data capture view and connect it to the DOM element.
    const view = Scandit.DataCaptureView.forContext(context);
    view.connectToElement(document.getElementById('data-capture-view'));

    // Add the basic overlay to visualize detected label fields.
    const basicOverlay = new Scandit.LabelCaptureBasicOverlay(labelCapture);

    view.addOverlay(basicOverlay);

    // Add the validation flow overlay to guide the user through capture.
    const validationFlowOverlay = new Scandit.LabelCaptureValidationFlowOverlay(labelCapture);
    validationFlowOverlay.listener = {
      didCaptureLabelWithFields: labelFields => {
        labelCapture.isEnabled = false;
        showResult(formatLabelFields(labelFields));
      },
    };

    view.addOverlay(validationFlowOverlay);

    // Switch camera on to start streaming frames and enable label capture.
    camera.switchToDesiredState(Scandit.FrameSourceState.On);
    labelCapture.isEnabled = true;
  },
  false
);

function formatLabelFields(label) {
  return label
    .map(field => {
      const { name } = field;
      let value;
      if (field.barcode != null) {
        value = field.barcode.data;
      } else if (field.date != null) {
        const { day, month, year } = field.date;
        value = `${day} - ${month} - ${year}`;
      } else if (field.text != null) {
        value = field.text;
      } else {
        value = 'N/A';
      }
      return `${name}: ${value}`;
    })
    .join('\n');
}

function showResult(result) {
  document.getElementById('modal-message').textContent = result;
  document.getElementById('result-modal').classList.remove('hidden');
}

function continueScan() {
  document.getElementById('result-modal').classList.add('hidden');
  if (labelCapture) {
    labelCapture.isEnabled = true;
  }
}
