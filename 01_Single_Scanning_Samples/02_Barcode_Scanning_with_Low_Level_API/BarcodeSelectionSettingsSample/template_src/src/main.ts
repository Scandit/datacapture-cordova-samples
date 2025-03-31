import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));

/**
 * Need to wait for the deviceready event to fire before bootstrapping, otherwise the Cordova plugins are not properly
 * loaded yet, e.g. the Scandit namespace is not available yet at the time of dependency injection.
 */
 if ((window as any).cordova) {
  console.info('Waiting with bootstrapping...');
  document.addEventListener('deviceready', () => {
    console.info('Bootstrapping now...');
    bootstrap();
  });
} else {
  bootstrap();
}
