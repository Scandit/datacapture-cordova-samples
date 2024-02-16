import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SettingsService } from '../services';
import {
  ViewfinderType,
  SizeSpecification,
  LocationSelectionType,
  BarcodeCaptureSymbologyFormValue,
} from '../models';

declare var Scandit;

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.component.html',
  styleUrls: ['scan.component.scss'],
})
export class ScanComponent implements AfterViewInit {
  private torchSwitchControl = new Scandit.TorchSwitchControl();
  private zoomSwitchControl = new Scandit.ZoomSwitchControl();

  public barcodeCapture;
  private context;
  private view;
  @ViewChild('captureView') captureView: ElementRef<HTMLDivElement>;

  private isPageActive = false;
  private latestScanTimestamp: number;

  private barcodeCaptureSettings = new Scandit.BarcodeCaptureSettings();

  public listener = {
    didScan: async (barcodeCapture, session, _) => {

      if (!this.isPageActive) {
        return;
      }

      this.latestScanTimestamp = new Date().getTime();
      const barcode = session.newlyRecognizedBarcodes[0];
      const symbology = new Scandit.SymbologyDescription(barcode.symbology);

      if (!this.settingsService.resultForm.value.CONTINUOUS_SCANNING) {
        this.captureView.nativeElement.style.zIndex = '-1';
        barcodeCapture.isEnabled = false;
      }

      const existingModal = await this.alertController.getTop();
      const modal = existingModal || (await this.alertController.create({ header: 'Scanned', buttons: [{ text: 'Ok'}] }));

      modal.subHeader = `${symbology.readableName}: ${barcode.data}`;
      modal.message = `Symbol count: ${barcode.symbolCount}`;

      // Show data scanned for Composite Codes.
      if (barcode.compositeFlag && barcode.compositeFlag !== Scandit.CompositeFlag.Unknown) {
        let compositeCodeType = '';

        switch (barcode.compositeFlag) {
          case Scandit.CompositeFlag.GS1TypeA:
            compositeCodeType = 'CC Type A';
            break;
          case Scandit.CompositeFlag.GS1TypeB:
            compositeCodeType = 'CC Type B';
            break;
          case Scandit.CompositeFlag.GS1TypeC:
            compositeCodeType = 'CC Type C';
            break;
          default:
            break;
        }

        modal.subHeader = '';
        modal.message = `
            ${compositeCodeType}<br/>
            ${symbology.readableName}<br/>
            ${barcode.data}<br/>
            ${barcode.compositeData}<br/>
            Symbol count: ${barcode.symbolCount}<br/>
        `;
      }

      // Show data scanned for Add-on Codes.
      if (barcode.addOnData) {
        modal.subHeader = '';
        modal.message = `
          ${symbology.readableName}:<br/>
          ${barcode.data}<br/>
          ${barcode.addOnData}<br/>
          Symbol count: ${barcode.symbolCount}<br/>
        `;
      }

      modal.onDidDismiss().then(() => {
        if (this.isPageActive) {
          this.continueScanning();
        }
      });

      if (!existingModal) {
        modal.present();
      }

      if (this.settingsService.resultForm.value.CONTINUOUS_SCANNING) {
        setTimeout(() => {
          if (new Date().getTime() - this.latestScanTimestamp >= 500) {
            this.alertController.dismiss();
          }
        }, 500);
      }
    }
  };

  constructor(
    private settingsService: SettingsService,
    private alertController: AlertController,
  ) {}

  public async ionViewDidEnter() {
    this.isPageActive = true;
    this.barcodeCapture.isEnabled = false;

    await this.barcodeCapture.applySettings(this.getBarcodeCaptureSettings());
    this.barcodeCapture.addListener(this.listener);

    this.applyFeedbackSettings();
    this.applyCodeDuplicateFilterSettings();
    this.applyCompositeTypeSettings();
    await this.applyCameraSettings();
    this.applyViewSettings();

    this.barcodeCapture.isEnabled = true;
  }

  public ionViewWillLeave() {
    this.isPageActive = false;
    this.barcodeCapture.isEnabled = false;
    this.context.frameSource.switchToDesiredState(Scandit.FrameSourceState.Off);
  }

  public ngAfterViewInit() {
    this.context = Scandit.DataCaptureContext.forLicenseKey(environment.scanditLicenseKey);
    this.barcodeCapture = Scandit.BarcodeCapture.forContext(this.context);
    this.barcodeCapture.addListener(this.listener);
  }

  public continueScanning() {
    if (this.settingsService.resultForm.value.CONTINUOUS_SCANNING) {
      return;
    }
    this.captureView.nativeElement.style.zIndex = '1';
    this.barcodeCapture.isEnabled = true;
  }

  public getBarcodeCaptureSettings() {
    const enabledSymbologiesSettings = Object.entries(this.settingsService.symbologiesForm.value)
      .map(([key, value]) => ({ ...value, key }))
      .filter(settings => settings.enabled);

    this.barcodeCaptureSettings.locationSelection = this.getLocationSelectionSettings();
    this.barcodeCaptureSettings.enableSymbologies(enabledSymbologiesSettings.map(({ key }) => Scandit.Symbology[key]));

    enabledSymbologiesSettings.forEach(settings => this.applySymbologySettings(this.barcodeCaptureSettings, settings));

    return this.barcodeCaptureSettings;
  }

  public getLocationSelectionSettings() {
    const {
      LOCATION_SELECTION_SIZE_SPECIFICATION,
      LOCATION_SELECTION_HEIGHT,
      LOCATION_SELECTION_HEIGHT_ASPECT,
      LOCATION_SELECTION_TYPE,
      LOCATION_SELECTION_WIDTH,
      LOCATION_SELECTION_WIDTH_ASPECT,
      LOCATION_SELECTION_SIZE,
    } = this.settingsService.locationSelectionForm.value;

    if (LOCATION_SELECTION_TYPE === LocationSelectionType.None) {
      return Scandit.NoneLocationSelection;
    }

    if (LOCATION_SELECTION_TYPE === LocationSelectionType.Radius) {
      const radius = this.getNumberWithUnit(LOCATION_SELECTION_SIZE);

      return new Scandit.RadiusLocationSelection(radius);
    }

    if (LOCATION_SELECTION_TYPE === LocationSelectionType.Rectangular) {
      const width = this.getNumberWithUnit(LOCATION_SELECTION_WIDTH);
      const height = this.getNumberWithUnit(LOCATION_SELECTION_HEIGHT);

      if (LOCATION_SELECTION_SIZE_SPECIFICATION === SizeSpecification.WidthAndHeight) {
        const size = new Scandit.SizeWithUnit(width, height);
        return Scandit.RectangularLocationSelection.withSize(size);
      }

      if (LOCATION_SELECTION_SIZE_SPECIFICATION === SizeSpecification.WidthAndHeightAspect) {
        return Scandit.RectangularLocationSelection.withWidthAndAspectRatio(width, LOCATION_SELECTION_HEIGHT_ASPECT);
      }

      if (LOCATION_SELECTION_SIZE_SPECIFICATION === SizeSpecification.HeightAndWidthAspect) {
        return Scandit.RectangularLocationSelection.withHeightAndAspectRatio(height, LOCATION_SELECTION_WIDTH_ASPECT);
      }
    }
  }

  public applyFeedbackSettings() {
    const { FEEDBACK_VIBRATION, FEEDBACK_SOUND } = this.settingsService.feedbackForm.value;

    const vibration = FEEDBACK_VIBRATION ? Scandit.Vibration.defaultVibration : null;
    const sound = FEEDBACK_SOUND ? Scandit.Sound.defaultSound : null;

    const feedback = new Scandit.BarcodeCaptureFeedback().success 
    feedback.success = new Scandit.Feedback(vibration, sound);

    this.barcodeCapture.feedback = feedback;
  }

  public applyCodeDuplicateFilterSettings() {
    const { CODE_DUPLICATE_FILTER } = this.settingsService.codeDuplicateFilterForm.value;

    const barcodeCaptureSettings = this.getBarcodeCaptureSettings();

    barcodeCaptureSettings.codeDuplicateFilter = CODE_DUPLICATE_FILTER * 1000;

    this.barcodeCapture.applySettings(barcodeCaptureSettings);
  }

  public applyCompositeTypeSettings() {
    const { COMPOSITE_TYPES } = this.settingsService.compositeTypes.value;

    const barcodeCaptureSettings = this.getBarcodeCaptureSettings();

    // Then enable the selected composite types, which in turn enable the corresponding symbologies.
    barcodeCaptureSettings.enabledCompositeTypes = COMPOSITE_TYPES;
    barcodeCaptureSettings.enableSymbologiesForCompositeTypes(COMPOSITE_TYPES);

    this.barcodeCapture.applySettings(barcodeCaptureSettings);
  }

  public applyCameraSettings(): Promise<void> {
    const {
      DESIRED_TORCH_STATE,
      CAMERA_POSITION,
      MAX_FRAME_RATE,
      PREFERRED_RESOLUTION,
      ZOOM_FACTOR,
      ZOOM_GESTURE_ZOOM_FACTOR,
      FOCUS_RANGE,
      FOCUS_GESTURE_STRATEGY,
    } = this.settingsService.cameraForm.value;

    const cameraSettings = new Scandit.CameraSettings({
      preferredResolution: PREFERRED_RESOLUTION,
      maxFrameRate: MAX_FRAME_RATE,
      zoomFactor: ZOOM_FACTOR,
      focusRange: FOCUS_RANGE,
      focusGestureStrategy: FOCUS_GESTURE_STRATEGY,
      zoomGestureZoomFactor: ZOOM_GESTURE_ZOOM_FACTOR,
    });

    const camera = Scandit.Camera.atPosition(CAMERA_POSITION);

    camera.desiredTorchState = DESIRED_TORCH_STATE ? Scandit.TorchState.On : Scandit.TorchState.Off;

    const switchToDesiredStatePromise = this.context.frameSource ?
      this.context.frameSource.switchToDesiredState(Scandit.FrameSourceState.Off) :
      Promise.resolve();

    return switchToDesiredStatePromise
      .then(() => camera.applySettings(cameraSettings))
      .then(() => this.context.setFrameSource(camera))
      .then(() => camera.switchToDesiredState(Scandit.FrameSourceState.On));
  }

  public applyViewSettings() {
    const { SCAN_AREA_GUIDES } = this.settingsService.scanAreaForm.value;

    this.captureView.nativeElement.style.zIndex = '1';
    if (!this.view) {
      this.view = Scandit.DataCaptureView.forContext(this.context);
    }

    this.applyPointOfInterestSettings(this.view);
    this.applyScanAreaSettings(this.view);
    this.applyLogoSettings(this.view);
    this.applyGesturesSettings(this.view);
    this.applyControlsSettings(this.view);

    this.view.connectToElement(this.captureView.nativeElement);

    this.applyOverlayStyleSettings(SCAN_AREA_GUIDES, this.view);
  }

  private applySymbologySettings(
    barcodeCaptureSettings,
    settings: BarcodeCaptureSymbologyFormValue & { key: string },
  ) {
    const symbologySettings = barcodeCaptureSettings.settingsForSymbology(Scandit.Symbology[settings.key]);

    if (settings.colorInverted !== undefined) {
      symbologySettings.isColorInvertedEnabled = settings.colorInverted;
    }

    if (settings.minimum !== undefined && settings.maximum !== undefined) {
      const activeSymbolCounts = new Array(settings.maximum + 1 - settings.minimum)
        .fill(0)
        .map((_, index) => settings.minimum + index);

      symbologySettings.activeSymbolCounts = activeSymbolCounts;
    }

    if (settings.extensions !== undefined && Array.isArray(settings.extensions)) {
      symbologySettings.enabledExtensions.forEach(extension => symbologySettings.setExtensionEnabled(extension, false));
      settings.extensions.forEach(extension => symbologySettings.setExtensionEnabled(extension, true));
    }
  }

  private applyLogoSettings(view) {
    const { LOGO_ANCHOR, LOGO_X, LOGO_Y } = this.settingsService.logoForm.value;

    const logoX = this.getNumberWithUnit(LOGO_X);
    const logoY = this.getNumberWithUnit(LOGO_Y);
    const logoOffset = new Scandit.PointWithUnit(logoX, logoY);

    view.logoAnchor = LOGO_ANCHOR;
    view.logoOffset = logoOffset;
  }

  private applyPointOfInterestSettings(view) {
    const { POINT_OF_INTEREST_X, POINT_OF_INTEREST_Y } = this.settingsService.pointOfInterestForm.value;

    const pointOfInterestX = this.getNumberWithUnit(POINT_OF_INTEREST_X);
    const pointOfInterestY = this.getNumberWithUnit(POINT_OF_INTEREST_Y);
    const pointOfInterest = new Scandit.PointWithUnit(pointOfInterestX, pointOfInterestY);

    view.pointOfInterest = pointOfInterest;
  }

  private applyScanAreaSettings(view) {
    const {
      SCAN_AREA_MARGIN_BOTTOM,
      SCAN_AREA_MARGIN_LEFT,
      SCAN_AREA_MARGIN_RIGHT,
      SCAN_AREA_MARGIN_TOP,
    } = this.settingsService.scanAreaForm.value;

    const scanAreaTop = this.getNumberWithUnit(SCAN_AREA_MARGIN_TOP);
    const scanAreaRight = this.getNumberWithUnit(SCAN_AREA_MARGIN_RIGHT);
    const scanAreaBottom = this.getNumberWithUnit(SCAN_AREA_MARGIN_BOTTOM);
    const scanAreaLeft = this.getNumberWithUnit(SCAN_AREA_MARGIN_LEFT);

    view.scanAreaMargins = new Scandit.MarginsWithUnit(scanAreaLeft, scanAreaRight, scanAreaTop, scanAreaBottom);
  }

  private applyGesturesSettings(view) {
    const { TAP_TO_FOCUS, SWIPE_TO_ZOOM } = this.settingsService.gesturesForm.value;

    view.focusGesture = TAP_TO_FOCUS ? new Scandit.TapToFocus() : null;
    view.swipeGesture = SWIPE_TO_ZOOM ? new Scandit.SwipeToZoom() : null;
  }

  private applyControlsSettings(view) {
    const { TORCH_BUTTON, ZOOM_BUTTON } = this.settingsService.controlsForm.value;

    if (TORCH_BUTTON === true) {
      view.addControl(this.torchSwitchControl);
    } else {
      view.removeControl(this.torchSwitchControl);
    }

    if (ZOOM_BUTTON === true) {
      view.addControl(this.zoomSwitchControl);
    } else {
      view.removeControl(this.zoomSwitchControl);
    }
  }

  private applyViewfinderSettings(overlay) {
    const {
      VIEWFINDER_STYLE,
      VIEWFINDER_LINE_STYLE,
      VIEWFINDER_DIMMING,
      VIEWFINDER_ANIMATED,
      VIEWFINDER_LOOPING,
      VIEWFINDER_COLOR,
      VIEWFINDER_RECTANGULAR_DISABLED_COLOR,
      VIEWFINDER_ENABLED_COLOR,
      VIEWFINDER_DISABLED_COLOR,
      VIEWFINDER_SIZE_SPECIFICATION,
      VIEWFINDER_HEIGHT,
      VIEWFINDER_HEIGHT_ASPECT,
      VIEWFINDER_TYPE,
      VIEWFINDER_WIDTH,
      VIEWFINDER_WIDTH_ASPECT,
      VIEWFINDER_SHORTER_DIM,
      VIEWFINDER_ASPECT_RATIO,
      VIEWFINDER_LASERLINE_WIDTH,
      VIEWFINDER_LASERLINE_STYLE,
      VIEWFINDER_AIMER_DOT_COLOR,
      VIEWFINDER_AIMER_FRAME_COLOR,
    } = this.settingsService.viewfinderForm.value;

    if (VIEWFINDER_TYPE === ViewfinderType.Aimer) {
      const viewfinder = new Scandit.AimerViewfinder();
      viewfinder.frameColor = this.getColor(VIEWFINDER_AIMER_FRAME_COLOR);
      viewfinder.dotColor = this.getColor(VIEWFINDER_AIMER_DOT_COLOR);

      overlay.viewfinder = viewfinder;
    }

    if (VIEWFINDER_TYPE === ViewfinderType.Laserline) {
      const viewfinder = new Scandit.LaserlineViewfinder(VIEWFINDER_LASERLINE_STYLE);
      viewfinder.width = this.getNumberWithUnit(VIEWFINDER_LASERLINE_WIDTH);
      viewfinder.enabledColor = this.getColor(VIEWFINDER_ENABLED_COLOR);
      viewfinder.disabledColor = this.getColor(VIEWFINDER_DISABLED_COLOR);

      overlay.viewfinder = viewfinder;
    }

    if (VIEWFINDER_TYPE === ViewfinderType.Rectangular) {
      const viewfinder = new Scandit.RectangularViewfinder(VIEWFINDER_STYLE, VIEWFINDER_LINE_STYLE);
      viewfinder.dimming = VIEWFINDER_DIMMING;
      const width = this.getNumberWithUnit(VIEWFINDER_WIDTH);
      const height = this.getNumberWithUnit(VIEWFINDER_HEIGHT);

      if (VIEWFINDER_ANIMATED) {
        viewfinder.animation = new Scandit.RectangularViewfinderAnimation(VIEWFINDER_LOOPING);
      }

      if (VIEWFINDER_SIZE_SPECIFICATION === SizeSpecification.WidthAndHeight) {
        const size = new Scandit.SizeWithUnit(width, height);
        viewfinder.setSize(size);
      }

      if (VIEWFINDER_SIZE_SPECIFICATION === SizeSpecification.WidthAndHeightAspect) {
        viewfinder.setWidthAndAspectRatio(width, VIEWFINDER_HEIGHT_ASPECT);
      }

      if (VIEWFINDER_SIZE_SPECIFICATION === SizeSpecification.HeightAndWidthAspect) {
        viewfinder.setHeightAndAspectRatio(height, VIEWFINDER_WIDTH_ASPECT);
      }

      if (VIEWFINDER_SIZE_SPECIFICATION === SizeSpecification.ShorterDimensionAndAspectRation) {
        viewfinder.setShorterDimensionAndAspectRatio(VIEWFINDER_SHORTER_DIM, VIEWFINDER_ASPECT_RATIO);
      }

      viewfinder.color = this.getColor(VIEWFINDER_COLOR);
      viewfinder.disabledColor = this.getColor(VIEWFINDER_RECTANGULAR_DISABLED_COLOR);
      overlay.viewfinder = viewfinder;
    }
  }

  private applyOverlayStyleSettings(SCAN_AREA_GUIDES, view) {
    const { BRUSH, OVERLAY_STYLE } = this.settingsService.overlayForm.value;

    view.overlays.forEach(viewOverlay => view.removeOverlay(viewOverlay))

    const overlay = Scandit.BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
        this.barcodeCapture,
        view,
        OVERLAY_STYLE,
    );

    overlay.shouldShowScanAreaGuides = SCAN_AREA_GUIDES;

    overlay.brush = new Scandit.Brush(
      this.getColor(BRUSH),
      this.getColor(BRUSH),
      1
    );

    this.applyViewfinderSettings(overlay);
  }

  private getColor(rgbaString: string) {
    const parts = rgbaString.replace('rgba(', '').replace(')', '').split(',');
    return Scandit.Color.fromRGBA(...parts);
  }

  private getNumberWithUnit({ value, unit }: { value: number; unit: string }) {
    return new Scandit.NumberWithUnit(value, unit);
  }

}
