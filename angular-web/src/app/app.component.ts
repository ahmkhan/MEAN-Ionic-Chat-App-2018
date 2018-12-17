import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { TokenService } from './services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showSpinner: boolean = false;
  token: any;

  constructor (private spinnerService: SpinnerService, private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    if (this.token) {
      this.router.navigate(['streams']);
    }
    else {
      this.router.navigate(['/']);
    }

    this.spinnerService.status.subscribe((val: boolean) => {
        this.showSpinner = val;
    });
}
}
