// @ts-check
/// <reference path="./global.d.ts" />

// Global variables for SDK components
/** @type {import('scandit-cordova-datacapture-core').DataCaptureContext} */
let context;
/** @type {import('scandit-cordova-datacapture-core').Camera} */
let camera;
/** @type {import('scandit-cordova-datacapture-barcode').BarcodeAr} */
let barcodeAr;
/** @type {import('scandit-cordova-datacapture-barcode').BarcodeArView} */
let barcodeArView;

let currentFeature = 'info-annotations'; // Default feature

// "Navigate" to a screen
function showScreen(screenId) {
  document.getElementById('home').classList.toggle('hidden', screenId !== 'home');
  document.getElementById('scanning').classList.toggle('hidden', screenId !== 'scanning');
  document.getElementById('results').classList.toggle('hidden', screenId !== 'results');
}

/**
 * Start scanning with selected feature
 * @param {string} featureType - The feature type to enable
 */
async function startScanning(featureType) {
  currentFeature = featureType;
  showScreen('scanning');

  // Update toolbar title
  const titles = {
    highlights: 'Highlights',
    'info-annotations': 'Info Annotations',
    popovers: 'Popovers',
    'status-icons': 'Status Icons',
  };
  const toolbarTitle = document.getElementById('toolbar-title');
  if (toolbarTitle) {
    toolbarTitle.textContent = titles[featureType] || 'MatrixScan AR';
  }

  await initializeSDK();

  // Update the view based on selected feature
  updateBarcodeArFeature(featureType);

  // Start camera
  if (camera) {
    await camera.switchToDesiredState(Scandit.FrameSourceState.On);
  }
}

function done() {
  uninitializeSDK();
  // Go back to home
  showScreen('home');
}

// Update BarcodeAr view based on selected feature
function updateBarcodeArFeature(featureType) {
  if (!barcodeArView) return;

  // Reset providers
  barcodeArView.highlightProvider = null;
  barcodeArView.annotationProvider = null;
  barcodeArView.uiListener = null;

  switch (featureType) {
    case 'highlights':
      // Show only highlights (circular dots)
      updateToHighlightMode();
      break;
    case 'info-annotations':
      updateToAnnotationsMode();
      break;
    case 'popovers':
      updateToPopoverMode();
      break;

    case 'status-icons':
      updateToStatusIconsMode();
      break;
  }
}

function updateToHighlightMode() {
  const selectedBrush = new Scandit.Brush(Scandit.Color.fromHex('#0000FF66'), Scandit.Color.fromHex('#0000FF'), 1.0);
  const normalBrush = new Scandit.Brush(Scandit.Color.fromHex('#00FFFF66'), Scandit.Color.fromHex('#00FFFF'), 1.0);
  const checkMarkIcon = new Scandit.ScanditIconBuilder()
    .withIcon(Scandit.ScanditIconType.Checkmark)
    .withIconColor(Scandit.Color.fromHex('#FFFFFF'))
    .build();
  const tappedBarcodes = [];

  barcodeArView.highlightProvider = {
    highlightForBarcode: async barcode => {
      const highlight = new Scandit.BarcodeArRectangleHighlight(barcode);

      if (tappedBarcodes.includes(barcode.data)) {
        highlight.brush = selectedBrush;
        highlight.icon = checkMarkIcon;
      } else {
        highlight.brush = normalBrush;
        highlight.icon = null;
      }
      return highlight;
    },
  };

  barcodeArView.uiListener = {
    didTapHighlightForBarcode: async (_, barcode, highlight) => {
      if (!barcode.data) return;

      if (tappedBarcodes.includes(barcode.data)) {
        highlight.brush = normalBrush;
        highlight.icon = null;
        tappedBarcodes.splice(tappedBarcodes.indexOf(barcode.data), 1);
      } else {
        highlight.brush = selectedBrush;
        highlight.icon = checkMarkIcon;
        tappedBarcodes.push(barcode.data);
      }
    },
  };
}

function updateToAnnotationsMode() {
  const checkMarkIcon = new Scandit.ScanditIconBuilder()
    .withIcon(Scandit.ScanditIconType.Checkmark)
    .withIconColor(Scandit.Color.fromHex('#000000'))
    .build();

  const exclamationMarkIcon = new Scandit.ScanditIconBuilder()
    .withIcon(Scandit.ScanditIconType.ExclamationMark)
    .withIconColor(Scandit.Color.fromHex('#000000'))
    .build();

  barcodeArView.highlightProvider = {
    highlightForBarcode: async barcode => {
      const highlight = new Scandit.BarcodeArCircleHighlight(barcode, Scandit.BarcodeArCircleHighlightPreset.Dot);
      highlight.brush = new Scandit.Brush(Scandit.Color.fromHex('#00FFFF'), Scandit.Color.fromHex('#00FFFF'), 1.0);
      return highlight;
    },
  };

  barcodeArView.annotationProvider = {
    annotationForBarcode: async barcode => {
      const closeup = new Scandit.BarcodeArInfoAnnotation(barcode);
      closeup.backgroundColor = Scandit.Color.fromHex('#FFFFFF');

      const header = new Scandit.BarcodeArInfoAnnotationHeader();
      header.text = 'Header';
      header.icon = checkMarkIcon;
      header.backgroundColor = Scandit.Color.fromHex('#00FFFF');
      closeup.header = header;

      const first = new Scandit.BarcodeArInfoAnnotationBodyComponent();
      first.text = 'This is text in a large container.';
      const second = new Scandit.BarcodeArInfoAnnotationBodyComponent();
      second.text = 'It can have multiple lines.';

      const third = new Scandit.BarcodeArInfoAnnotationBodyComponent();
      third.leftIcon = checkMarkIcon;
      third.text = 'Point';

      const fourth = new Scandit.BarcodeArInfoAnnotationBodyComponent();
      fourth.leftIcon = checkMarkIcon;
      fourth.text = 'Point';
      closeup.body = [first, second, third, fourth];

      const footer = new Scandit.BarcodeArInfoAnnotationFooter();
      footer.text = 'Tap to change color';
      footer.backgroundColor = Scandit.Color.fromHex('#121619');
      closeup.footer = footer;

      closeup.width = Scandit.BarcodeArInfoAnnotationWidthPreset.Large;
      closeup.isEntireAnnotationTappable = true;

      closeup.listener = {
        didTap: annotation => {
          // Toggle the color of the header and the icon
          if (annotation.header.icon.icon === Scandit.ScanditIconType.ExclamationMark) {
            annotation.header.backgroundColor = Scandit.Color.fromHex('#00FFFF');
            annotation.header.icon = checkMarkIcon;
          } else {
            annotation.header.backgroundColor = Scandit.Color.fromHex('#F0BD30');
            annotation.header.icon = exclamationMarkIcon;
          }
        },
        didTapHeader: () => {},
        didTapFooter: () => {},
        didTapLeftIcon: () => {},
        didTapRightIcon: () => {},
      };

      const faraway = new Scandit.BarcodeArInfoAnnotation(barcode);
      faraway.width = Scandit.BarcodeArInfoAnnotationWidthPreset.Medium;

      const farawayBody = new Scandit.BarcodeArInfoAnnotationBodyComponent();
      farawayBody.text = 'Body text';
      faraway.body = [farawayBody];

      const annotation = new Scandit.BarcodeArResponsiveAnnotation(barcode, closeup, faraway);
      annotation.threshold = 0.05;
      return annotation;
    },
  };
}

function updateToPopoverMode() {
  const redColor = Scandit.Color.fromHex('#D92121');
  const greenColor = Scandit.Color.fromHex('#0D853D');
  const whiteColor = Scandit.Color.fromHex('#FFFFFF');

  const redBrush = new Scandit.Brush(redColor, redColor, 1.0);
  const greenBrush = new Scandit.Brush(greenColor, greenColor, 1.0);

  // Track barcode states: 'wrong', 'accepted', 'rejected'
  const barcodeStatus = new Map();
  const highlights = new Map();

  // Create button icons (with backgrounds for popover buttons)
  const rejectButtonIcon = new Scandit.ScanditIconBuilder()
    .withIcon(Scandit.ScanditIconType.XMark)
    .withIconColor(whiteColor)
    .withBackgroundShape(Scandit.ScanditIconShape.Circle)
    .withBackgroundColor(redColor)
    .build();

  const acceptButtonIcon = new Scandit.ScanditIconBuilder()
    .withIcon(Scandit.ScanditIconType.Checkmark)
    .withIconColor(whiteColor)
    .withBackgroundShape(Scandit.ScanditIconShape.Circle)
    .withBackgroundColor(greenColor)
    .build();

  barcodeArView.highlightProvider = {
    highlightForBarcode: async barcode => {
      if (!barcode.data) return null;

      // Assign initial status - alternate between 'wrong' and 'accepted'
      if (!barcodeStatus.has(barcode.data)) {
        barcodeStatus.set(barcode.data, barcodeStatus.size % 2 === 0 ? 'wrong' : 'accepted');
      }

      // Get or create highlight
      let highlight = highlights.get(barcode.data);
      if (!highlight) {
        highlight = new Scandit.BarcodeArCircleHighlight(barcode, Scandit.BarcodeArCircleHighlightPreset.Icon);
        highlights.set(barcode.data, highlight);
      }

      // Update highlight based on status
      const status = barcodeStatus.get(barcode.data);
      if (status === 'accepted') {
        highlight.brush = greenBrush;
        highlight.icon = new Scandit.ScanditIconBuilder()
          .withIcon(Scandit.ScanditIconType.Checkmark)
          .withIconColor(whiteColor)
          .build();
      } else if (status === 'wrong') {
        highlight.brush = redBrush;
        highlight.icon = new Scandit.ScanditIconBuilder()
          .withIcon(Scandit.ScanditIconType.ExclamationMark)
          .withIconColor(whiteColor)
          .build();
      } else if (status === 'rejected') {
        highlight.brush = redBrush;
        highlight.icon = new Scandit.ScanditIconBuilder()
          .withIcon(Scandit.ScanditIconType.XMark)
          .withIconColor(whiteColor)
          .build();
      }

      return highlight;
    },
  };

  barcodeArView.annotationProvider = {
    annotationForBarcode: async barcode => {
      if (!barcode.data) return null;

      // Only show popovers for 'wrong' barcodes
      if (barcodeStatus.get(barcode.data) !== 'wrong') {
        return null;
      }

      const rejectButton = new Scandit.BarcodeArPopoverAnnotationButton(rejectButtonIcon, 'Reject');
      const acceptButton = new Scandit.BarcodeArPopoverAnnotationButton(acceptButtonIcon, 'Accept');

      const annotation = new Scandit.BarcodeArPopoverAnnotation(barcode, [rejectButton, acceptButton]);
      annotation.annotationTrigger = Scandit.BarcodeArAnnotationTrigger.HighlightTap;

      annotation.listener = {
        didTapButton: async (annotation, _button, buttonIndex) => {
          if (!annotation.barcode.data) return;

          // Update status: 0 = reject, 1 = accept
          if (buttonIndex === 0) {
            barcodeStatus.set(annotation.barcode.data, 'rejected');
          } else if (buttonIndex === 1) {
            barcodeStatus.set(annotation.barcode.data, 'accepted');
          }

          // Update the highlight
          const highlight = highlights.get(annotation.barcode.data);
          const status = barcodeStatus.get(annotation.barcode.data);
          if (highlight && status === 'accepted') {
            highlight.brush = greenBrush;
            highlight.icon = new Scandit.ScanditIconBuilder()
              .withIcon(Scandit.ScanditIconType.Checkmark)
              .withIconColor(whiteColor)
              .build();
          } else if (highlight && status === 'rejected') {
            highlight.brush = redBrush;
            highlight.icon = new Scandit.ScanditIconBuilder()
              .withIcon(Scandit.ScanditIconType.XMark)
              .withIconColor(whiteColor)
              .build();
          }
        },
      };

      return annotation;
    },
  };
}

function updateToStatusIconsMode() {
  const redColor = Scandit.Color.fromHex('#D92121');
  const yellowColor = Scandit.Color.fromHex('#FBC02C');
  const blackColor = Scandit.Color.fromHex('#000000');
  const whiteColor = Scandit.Color.fromHex('#FFFFFF');

  // Track barcode status: 'closeToExpiry' or 'expired'
  const barcodeStatus = new Map();

  barcodeArView.highlightProvider = {
    highlightForBarcode: async barcode => {
      if (!barcode.data) return null;

      // Assign initial status - alternate between 'closeToExpiry' and 'expired'
      if (!barcodeStatus.has(barcode.data)) {
        barcodeStatus.set(barcode.data, barcodeStatus.size % 2 === 0 ? 'closeToExpiry' : 'expired');
      }

      // Return a rectangular highlight
      const highlight = new Scandit.BarcodeArRectangleHighlight(barcode);
      return highlight;
    },
  };

  barcodeArView.annotationProvider = {
    annotationForBarcode: async barcode => {
      if (!barcode.data) return null;

      const annotation = new Scandit.BarcodeArStatusIconAnnotation(barcode);
      const status = barcodeStatus.get(barcode.data);

      if (status === 'closeToExpiry') {
        // Yellow icon with black exclamation mark
        annotation.text = 'Close to expiry';
        annotation.icon = new Scandit.ScanditIconBuilder()
          .withBackgroundShape(Scandit.ScanditIconShape.Circle)
          .withBackgroundColor(yellowColor)
          .withIcon(Scandit.ScanditIconType.ExclamationMark)
          .withIconColor(blackColor)
          .build();
      } else if (status === 'expired') {
        // Red icon with white exclamation mark
        annotation.text = 'Item expired';
        annotation.icon = new Scandit.ScanditIconBuilder()
          .withBackgroundShape(Scandit.ScanditIconShape.Circle)
          .withBackgroundColor(redColor)
          .withIcon(Scandit.ScanditIconType.ExclamationMark)
          .withIconColor(whiteColor)
          .build();
      }

      return annotation;
    },
  };
}

/**
 * Initialize Scandit SDK
 */
async function initializeSDK() {
  if (!context) {
    // Enter your Scandit License key here.
    // Your Scandit License key is available via your Scandit SDK web account.
    context = Scandit.DataCaptureContext.initialize('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');
  }

  // Use the world-facing (back) camera and set it as the frame source of the context.
  const cameraSettings = Scandit.BarcodeAr.createRecommendedCameraSettings();
  cameraSettings.preferredResolution = Scandit.VideoResolution.UHD4K;
  // @ts-ignore
  camera = Scandit.Camera.withSettings(cameraSettings);
  if (!camera) throw new Error('Camera is not available');

  await context.setFrameSource(camera);

  // The BarcodeAr process is configured through BarcodeAr settings
  const settings = new Scandit.BarcodeArSettings();

  // The settings instance initially has all types of barcodes (symbologies) disabled.
  // For the purpose of this sample we enable a generous set of symbologies.
  // In your own app ensure that you only enable the symbologies that your app requires
  // as every additional enabled symbology has an impact on processing times.
  settings.enableSymbologies([
    Scandit.Symbology.EAN13UPCA,
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.Code39,
    Scandit.Symbology.Code128,
    Scandit.Symbology.QR,
    Scandit.Symbology.DataMatrix,
  ]);

  // Create BarcodeAr mode with the settings
  barcodeAr = new Scandit.BarcodeAr(settings);

  // Create BarcodeAr view settings
  const viewSettings = new Scandit.BarcodeArViewSettings();

  // Create the BarcodeAr view
  barcodeArView = new Scandit.BarcodeArView({
    context,
    barcodeAr,
    settings: viewSettings,
    cameraSettings,
  });

  // Connect the BarcodeAr view to the HTML element
  const barcodeArElement = document.getElementById('barcode-ar-view');
  if (!barcodeArElement) throw new Error('BarcodeAr view element not found');

  barcodeArView.connectToElement(barcodeArElement);

  // Don't start the camera yet - wait for user to select a feature
}

async function uninitializeSDK() {
  // Stop camera
  if (camera) {
    await camera.switchToDesiredState(Scandit.FrameSourceState.Off);
    camera = null;
  }

  barcodeArView.detachFromElement();
  barcodeArView = null;

  // Go back to home
  showScreen('home');
}

// Initialize on device ready
document.addEventListener(
  'deviceready',
  async () => {
    // Just show the home screen, don't initialize SDK yet
    showScreen('home');
  },
  false
);
