import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  fullname = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  constructor() { }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' : '';
  };

  signUpBtn() {
    if (!this.fullname.value) {
      alert('Please Enter Full Name');
      return;
    }
    if (!this.username.value) {
      alert('Please Enter User Name');
      return;
    }
    if (!this.email.value) {
      alert('Please Enter Email');
      return;
    }
    if (!this.password.value) {
      alert('Please Enter Password');
      return;
    }
  };

}
