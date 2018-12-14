import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

    showSpinner(value: boolean) {
        this.status.next(value);
    };
}
