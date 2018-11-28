import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  constructor() { }

  ngOnInit() {
  }

  loginBtn() {
    if (!this.username.value) {
      alert('Please Type User Name');
      return;
    }
    if (!this.password.value) {
      alert('Please Type Password');
      return;
    }
  };

}
