import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ModalPage } from '../modal/modal.page';

declare var Scandit;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public version = Scandit.DataCaptureVersion.pluginVersion;

  constructor(
    public modalController: ModalController,
  ) { }

  public async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
    });
    return await modal.present();
  }
}
