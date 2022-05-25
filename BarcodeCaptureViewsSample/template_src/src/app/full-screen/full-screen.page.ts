import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { environment } from 'src/environments/environment';

declare var Scandit;

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.page.html',
  styleUrls: ['./full-screen.page.scss'],
})
export class FullScreenPage implements AfterViewInit, ViewDidEnter, ViewWillLeave, OnDestroy {
  private context = Scandit.DataCaptureContext.forLicenseKey(environment.scanditLicenseKey);
  private camera = Scandit.Camera.default;

  private settings = new Scandit.BarcodeCaptureSettings();
  private barcodeCapture = Scandit.BarcodeCapture.forContext(this.context, this.settings);

  private captureView = Scandit.DataCaptureView.forContext(this.context);
  @ViewChild('captureView') captureViewElement: ElementRef<HTMLDivElement>;
  private overlay = Scandit.BarcodeCaptureOverlay.withBarcodeCaptureForView(this.barcodeCapture, this.captureView);

  public isCaptureViewConnected = false;

  constructor(
    private alertController: AlertController,
  ) { }

  ngAfterViewInit() {
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
    this.barcodeCapture.applySettings(this.settings);

    this.barcodeCapture.addListener({
      didScan: async (barcodeCapture, session) => {
        const barcode = session.newlyRecognizedBarcodes[0];
        const symbology = new Scandit.SymbologyDescription(barcode.symbology);

        this.captureViewElement.nativeElement.style.zIndex = '-1';
        this.barcodeCapture.isEnabled = false;

        const alert = await this.alertController.create({
          header: 'Scanned',
          subHeader: `${symbology.readableName}: ${barcode.data}`,
          message: `Symbol count: ${barcode.symbolCount}`,
          buttons: [{ text: 'Ok' }]
        });
        alert.onDidDismiss().then(() => {
          this.captureViewElement.nativeElement.style.zIndex = '1';
          this.barcodeCapture.isEnabled = true;
        });
  
        alert.present();
      }
    });

    this.context.setFrameSource(this.camera);
    this.camera.switchToDesiredState(Scandit.FrameSourceState.On);
  }

  ionViewDidEnter(): void {
    this.captureView.connectToElement(this.captureViewElement.nativeElement);
    this.isCaptureViewConnected = true;

    this.barcodeCapture.isEnabled = true;
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
}
