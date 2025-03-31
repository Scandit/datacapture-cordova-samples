import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UiService } from 'src/app/services/ui.service';
import { NavigationItem } from '../../../config';
import { SettingsBase } from '../settings-base';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss'],
})
export class SettingsListComponent extends SettingsBase implements OnInit {

  public items$: Observable<NavigationItem[]>;

  constructor(
    protected route: ActivatedRoute,
    protected platform: Platform,
    protected uiService: UiService,
  ) {
    super(route, platform, uiService);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.items$ = this.route.data.pipe(map(data => data?.items));
  }
}
