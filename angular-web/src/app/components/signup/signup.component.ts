import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {SpinnerService} from '../../services/spinner.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private popupMsg: MatSnackBar, private router: Router, private spinnerService: SpinnerService, private tokenService: TokenService) { }

  ngOnInit() {
    this.createSignUpForm();
  }

  createSignUpForm() {
    this.signupForm = this.formBuilder.group({
      FullName: ['', Validators.required],
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]]
    });
  };

  signUpBtn() {
    let snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.panelClass = ['custom-class'];
    snackBarConfig.duration = 2000;
    snackBarConfig.verticalPosition = 'top';

    this.spinnerService.showSpinner(true);

    this.authService.registerNewUserService('/registerNewUser', this.signupForm.value).subscribe((userData) => {
      if (userData.message == 'User Successfully Saved in DB') {
        this.popupMsg.open(userData.message, '', snackBarConfig);
        setTimeout(() => {
          this.tokenService.setToken(userData.token);
          this.spinnerService.showSpinner(false);
          this.router.navigate(['streams']);
        }, 3000);
      }
    }, (signupError) => {
      console.log('signUpError', signupError.error.message);
      if (signupError && signupError.error && signupError.error.errorMsg) {
        this.popupMsg.open(signupError.error.errorMsg[0].message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 3000);
      }

      if (signupError.error.message == 'This User Name Already Exists in DB') {
        this.popupMsg.open(signupError.error.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 3000);
      }
      
      if (signupError.error.message == 'This Email Address Already Exists in DB') {
        this.popupMsg.open(signupError.error.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 3000);
      }
    }); 
  };

}
