import { Component, ViewChild, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { IonBackButtonDelegate, NavController, GestureController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-header',
  templateUrl: 'settings-header.component.html',
  styleUrls: ['settings-header.component.scss'],
})
export class SettingsHeaderComponent implements AfterViewInit, OnInit {

  public label$: Observable<string>;
  private lastClickTimestamp = 0;

  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;
  @ViewChild('host', { static: false, read: ElementRef }) host: ElementRef<HTMLDivElement>;

  constructor(
    private navCtrl: NavController,
    private uiService: UiService,
    private gestureCtrl: GestureController,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.label$ = this.uiService.settingsLabel$;
  }

  public ngAfterViewInit() {
    this.setUIBackButtonAction();

    const gesture = this.gestureCtrl.create({
      el: this.host.nativeElement,
      threshold: 0,
      gestureName: 'DB_CLICK',
      onStart: () => {
        this.onDoubleClickStart();
      }
    });

    gesture.enable();
  }

  private setUIBackButtonAction() {
    this.backButton.onClick = () => {
      this.navCtrl.back();
    };
  }

  onDoubleClickStart() {
    const now = Date.now();

    if (Math.abs(now - this.lastClickTimestamp) <= 500) {
      try {
        let levelsCount = this.router.url.split('settings')[1].split('/').length;

        while (!!levelsCount) {
          this.navCtrl.back();
          levelsCount -= 1;
        }
      } catch (err) {
        console.warn(err);
      }
      this.lastClickTimestamp = 0;
    } else {
      this.lastClickTimestamp = now;
    }
  }

}
