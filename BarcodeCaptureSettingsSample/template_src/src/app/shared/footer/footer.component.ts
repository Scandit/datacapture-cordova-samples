import { Component, AfterViewInit } from '@angular/core';

declare var Scandit;

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss'],
})
export class FooterComponent implements AfterViewInit {

  public version: string;

  public ngAfterViewInit() {
    this.version = Scandit.DataCaptureVersion.pluginVersion;
  }

}
