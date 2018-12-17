import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { Router } from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {SpinnerService} from '../../services/spinner.service';
import {TokenService} from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private popupMsg: MatSnackBar, private router: Router, private spinnerService: SpinnerService, private tokenService: TokenService) { }

  ngOnInit() {
    this.createSignInForm();
  }

  createSignInForm() {
    this.signInForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Password: ['', [Validators.required]]
    });
  };

  signInBtn() {
    let snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.panelClass = ['custom-class'];
    snackBarConfig.duration = 2000;
    snackBarConfig.verticalPosition = 'top';

    this.spinnerService.showSpinner(true);

    this.authService.loginUserService('/loginUser', this.signInForm.value).subscribe((loginUserData) => {
      if (loginUserData.message === "User Sign In Successful") {
        this.popupMsg.open(loginUserData.message, '', snackBarConfig);
        setTimeout(() => {
          this.tokenService.setToken(loginUserData.token);
          this.spinnerService.showSpinner(false);
          this.router.navigate(['streams']);
        }, 3000);
      }
    }, (errorLoginUser) => {
      if (errorLoginUser.error && errorLoginUser.error.message === "Password Not Match") {
        this.popupMsg.open(errorLoginUser.error.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 3000);
      }
      
      else if (errorLoginUser.error && errorLoginUser.error.message === "Username not exists in DB") {
        this.popupMsg.open(errorLoginUser.error.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 3000);
      }
      else {
        this.popupMsg.open(errorLoginUser.error.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 3000);
      }
    });
  };

}
