import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private popupMsg: MatSnackBar) { }

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
    snackBarConfig.duration = 3000;
    snackBarConfig.verticalPosition = 'top';

    this.authService.registerNewUserService('/registerNewUser', this.signupForm.value).subscribe((userData) => {
      console.log('userData', userData);
      if (userData.message == 'User Successfully Saved in DB') {
        this.popupMsg.open(userData.message, '', snackBarConfig);
      }
    }, (signupError) => {
      console.log('signUpError', signupError.error.message);
      if (signupError && signupError.error && signupError.error.errorMsg) {
        this.popupMsg.open(signupError.error.errorMsg[0].message, '', snackBarConfig);
      }

      if (signupError.error.message == 'This User Name Already Exists in DB') {
        this.popupMsg.open(signupError.error.message, '', snackBarConfig);
      }
      
      if (signupError.error.message == 'This Email Address Already Exists in DB') {
        this.popupMsg.open(signupError.error.message, '', snackBarConfig);
      }
    }); 
  };

}
