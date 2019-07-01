import { Component, OnInit } from '@angular/core';
import {TokenService} from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  userName: any;

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    this.userName = this.tokenService.getPayload();
  }

  logoutBtn() {
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  }

  goStreamPage() {
    this.router.navigate(['streams']);
  }

}
