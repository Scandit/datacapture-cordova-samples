import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GestureController, IonBackButtonDelegate, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UiService } from 'src/app/services/ui.service';

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
  ) { }

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
      this.router.navigate(['/']);
      this.lastClickTimestamp = 0;
    } else {
      this.lastClickTimestamp = now;
    }
  }

}
