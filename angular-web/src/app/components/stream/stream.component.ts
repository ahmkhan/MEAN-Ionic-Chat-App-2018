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
  streamsTab: boolean = false;
  topStreamsTab: boolean = false;

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    this.streamsTab = true;
    this.token = this.tokenService.getPayload();
    console.log('this.token', this.token);
  };

  changeTabsEvent(tabsValue) {
    if (tabsValue.tab.textLabel == 'Streams') {
      this.streamsTab = true;
      this.topStreamsTab = false;
    }

    if (tabsValue.tab.textLabel == 'Top Streams') {
      this.streamsTab = false;
      this.topStreamsTab = true;
    }
  };

}
