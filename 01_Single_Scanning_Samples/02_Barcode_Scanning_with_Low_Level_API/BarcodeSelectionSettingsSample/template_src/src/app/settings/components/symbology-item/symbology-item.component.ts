import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SettingsService } from 'src/app/services';

@Component({
  selector: 'app-symbology-item',
  templateUrl: './symbology-item.component.html',
  styleUrls: ['./symbology-item.component.scss'],
})
export class SymbologyItemComponent implements OnInit {

  @Input() symbology: string;
  @Input() enabled: boolean;

  public description;

  constructor(
    protected platform: Platform,
    protected settingsService: SettingsService,
  ) {}

  public ngOnInit() {
    this.description = this.settingsService.symbologies?.[this.symbology]?.description;
  }

  public get isIos() {
    return this.platform.is('ios');
  }

  public get lines() {
    return this.isIos ? 'full' : 'none';
  }

}
