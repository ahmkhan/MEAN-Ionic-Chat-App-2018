import { Component, OnInit } from '@angular/core';
import {TokenService} from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {

  token: any;

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    this.token = this.tokenService.getToken();
    console.log('this.token===', this.token);
  }

  logoutBtn() {
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  }

}
