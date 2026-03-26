// @ts-check
/// <reference path="./global.d.ts" />

const Elements = {
  homePage: document.getElementById('home-page'),
  scanPage: document.getElementById('scan-page'),
  startScanButton: document.getElementById('start-scan-button'),
  backButton: document.getElementById('back-button'),
  scanCount: document.getElementById('scan-count'),
  resultsList: document.getElementById('results-list'),
  clearButton: document.getElementById('clear-button'),
};

/** @type {import('scandit-cordova-datacapture-core').DataCaptureContext} */
let context;
/** @type {import('scandit-cordova-datacapture-barcode').SparkScan | null} */
let sparkScan;
/** @type {import('scandit-cordova-datacapture-barcode').SparkScanView | null} */
let sparkScanView;
/**
 * @type {Array<{data: string | null, symbology: string}>}
 */
let scannedItems = [];

document.addEventListener(
  'deviceready',
  () => {
    setupEventListeners();
  },
  false
);

const setupSparkScan = () => {
  // Only setup if not already initialized
  if (sparkScan && sparkScanView) {
    return;
  }

  // Enter your Scandit License key here.
  // Your Scandit License key is available via your Scandit SDK web account.
  context = Scandit.DataCaptureContext.initialize('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');

  // The spark scan process is configured through SparkScan settings
  // which are then applied to the spark scan instance that manages the spark scan.
  const sparkScanSettings = new Scandit.SparkScanSettings();

  // The settings instance initially has all types of barcodes (symbologies) disabled.
  // For the purpose of this sample we enable a very generous set of symbologies.
  // In your own app ensure that you only enable the symbologies that your app requires
  // as every additional enabled symbology has an impact on processing times.
  sparkScanSettings.enableSymbologies([
    Scandit.Symbology.EAN13UPCA,
    Scandit.Symbology.EAN8,
    Scandit.Symbology.UPCE,
    Scandit.Symbology.Code39,
    Scandit.Symbology.Code128,
    Scandit.Symbology.InterleavedTwoOfFive,
  ]);

  // Some linear/1d barcode symbologies allow you to encode variable-length data.
  // By default, the Scandit Data Capture SDK only scans barcodes in a certain length range.
  // If your application requires scanning of one of these symbologies, and the length is
  // falling outside the default range, you may need to adjust the "active symbol counts"
  // for this symbology. This is shown in the following few lines of code for one of the
  // variable-length symbologies.
  const symbologySettings = sparkScanSettings.settingsForSymbology(Scandit.Symbology.Code39);
  symbologySettings.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  // Create the spark scan instance.
  // Spark scan will automatically apply and maintain the optimal camera settings.
  sparkScan = new Scandit.SparkScan(sparkScanSettings);

  // Register a listener to get informed whenever a new barcode is scanned.
  sparkScan.addListener({
    didScan: async (_sparkScan, session) => {
      const barcode = session.newlyRecognizedBarcode;

      if (barcode && isValidBarcode(barcode)) {
        const symbologyDescription = new Scandit.SymbologyDescription(barcode.symbology);

        scannedItems.push({
          data: barcode.data,
          symbology: symbologyDescription.readableName,
        });

        updateScanList();
      }
    },
  });

  // Create the SparkScan view
  const sparkScanViewSettings = new Scandit.SparkScanViewSettings();
  sparkScanView = Scandit.SparkScanView.forContext(context, sparkScan, sparkScanViewSettings);

  // Setup the feedback delegate to emit different feedback based on the scanned barcode
  sparkScanView.feedbackDelegate = {
    feedbackForBarcode: barcode => {
      if (isValidBarcode(barcode)) {
        return new Scandit.SparkScanBarcodeSuccessFeedback();
      } else {
        return new Scandit.SparkScanBarcodeErrorFeedback(
          'Wrong barcode',
          60,
          Scandit.Color.fromHex('#FF0000'),
          new Scandit.Brush(Scandit.Color.fromHex('#FF0000'), Scandit.Color.fromHex('#FF0000'), 1),
          null
        );
      }
    },
  };
};

const teardownSparkScan = () => {
  // Remove mode from context
  if (context && sparkScan) {
    context.removeMode(sparkScan);
  }

  // Hide and dispose of the view
  if (sparkScanView) {
    sparkScanView.hide();
    sparkScanView.dispose();
    sparkScan = null;
    sparkScanView = null;
  }
};

/**
 *
 * @param {import('scandit-cordova-datacapture-barcode').Barcode} barcode
 */
const isValidBarcode = barcode => {
  return barcode.data != null && barcode.data !== '123456789';
};

const setupEventListeners = () => {
  Elements.startScanButton.addEventListener('click', showScanPage);
  Elements.backButton.addEventListener('click', showHomePage);
  Elements.clearButton.addEventListener('click', clearList);
};

const showScanPage = () => {
  // Setup SparkScan when navigating to scan page
  setupSparkScan();

  Elements.homePage.classList.add('hidden');
  Elements.scanPage.classList.add('active');

  if (sparkScanView) {
    sparkScanView.show();
  }
};

const showHomePage = () => {
  // Teardown SparkScan when navigating back to home
  teardownSparkScan();

  Elements.scanPage.classList.remove('active');
  Elements.homePage.classList.remove('hidden');
  clearList();
};

const updateScanList = () => {
  // Update count
  const count = scannedItems.length;
  Elements.scanCount.textContent = `${count} ${count === 0 || count > 1 ? 'items' : 'item'}`;

  // Update list
  Elements.resultsList.innerHTML = '';
  scannedItems.forEach((item, index) => {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';

    resultItem.innerHTML = `
      <div class="result-image"></div>
      <div class="result-data">
        <p class="result-barcode">${item.data}</p>
        <p class="result-symbology">${item.symbology}</p>
      </div>
    `;

    Elements.resultsList.appendChild(resultItem);
  });

  // Scroll to bottom to show newest item
  Elements.resultsList.scrollTop = Elements.resultsList.scrollHeight;
};

const clearList = () => {
  scannedItems = [];
  updateScanList();
};
