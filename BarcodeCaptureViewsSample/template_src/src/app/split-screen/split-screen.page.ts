import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { environment } from 'src/environments/environment';

declare var Scandit;

interface Result {
  data: string;
  symbology: string;
}

@Component({
  selector: 'app-split-screen',
  templateUrl: './split-screen.page.html',
  styleUrls: ['./split-screen.page.scss'],
})
export class SplitScreenPage implements AfterViewInit, ViewDidEnter, ViewWillLeave, OnDestroy {
  private context = Scandit.DataCaptureContext.forLicenseKey(environment.scanditLicenseKey);
  private camera = Scandit.Camera.default;

  private settings = new Scandit.BarcodeCaptureSettings();
  private barcodeCapture = Scandit.BarcodeCapture.forContext(this.context, this.settings);

  private captureView = Scandit.DataCaptureView.forContext(this.context);
  @ViewChild('captureView') captureViewElement: ElementRef<HTMLDivElement>;
  private overlay = Scandit.BarcodeCaptureOverlay.withBarcodeCaptureForView(this.barcodeCapture, this.captureView);

  public results: Result[] = [];

  public isCaptureViewConnected = false;

  private scanTimer;

  constructor(
    private changeDetection: ChangeDetectorRef,
  ) { }

  ngAfterViewInit() {
    this.overlay.viewfinder = new Scandit.LaserlineViewfinder(Scandit.LaserlineViewfinderStyle.Animated);

    this.settings.enableSymbologies([
      Scandit.Symbology.EAN13UPCA,
      Scandit.Symbology.EAN8,
      Scandit.Symbology.UPCE,
      Scandit.Symbology.QR,
      Scandit.Symbology.DataMatrix,
      Scandit.Symbology.Code39,
      Scandit.Symbology.Code128,
      Scandit.Symbology.InterleavedTwoOfFive,
    ]);
    this.settings.codeDuplicateFilter = 1000;
    this.settings.locationSelection = new Scandit.RadiusLocationSelection(
      new Scandit.NumberWithUnit(0, Scandit.MeasureUnit.Fraction)
    );
    this.barcodeCapture.applySettings(this.settings);

    this.barcodeCapture.addListener({
      didScan: async (barcodeCapture, session) => {
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new Scandit.SymbologyDescription(barcode.symbology);

        this.results.push({ data: barcode.data, symbology: symbology.readableName });
        this.changeDetection.detectChanges();

        this.resetScanTimeout();
      }
    });

    this.context.setFrameSource(this.camera);
    this.camera.switchToDesiredState(Scandit.FrameSourceState.On);
  }

  ionViewDidEnter(): void {
    this.captureView.connectToElement(this.captureViewElement.nativeElement);
    this.isCaptureViewConnected = true;

    this.barcodeCapture.isEnabled = true;

    this.resetScanTimeout();
  }

  ionViewWillLeave(): void {
    this.captureView.detachFromElement();
    this.isCaptureViewConnected = false;

    this.camera.switchToDesiredState(Scandit.FrameSourceState.Off);
    this.barcodeCapture.isEnabled = false;
  }

  ngOnDestroy() {
    this.context.dispose();
  }

  public clearResults() {
    this.results = [];
  }

  public resetScanTimeout() {
    clearTimeout(this.scanTimer);
    this.barcodeCapture.isEnabled = true;
    this.scanTimer = setTimeout(() => {
      this.barcodeCapture.isEnabled = false;
      this.changeDetection.detectChanges();
    }, 10000);
  }
}
