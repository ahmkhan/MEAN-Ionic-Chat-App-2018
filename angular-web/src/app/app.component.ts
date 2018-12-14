import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-web';
  showSpinner: boolean = false;

  constructor (private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.spinnerService.status.subscribe((val: boolean) => {
        this.showSpinner = val;
    });
}
}
