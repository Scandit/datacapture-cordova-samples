import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable, interval } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

declare var Scandit;

@Injectable({ providedIn: 'root' })
export class ScanditGuard implements CanActivate {

  public canActivate(): Observable<boolean> | boolean {

    return interval(200).pipe(
      filter(() => typeof(Scandit) !== 'undefined'),
      take(1),
      map(() => true)
    );

  }

}
