import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  hideUserContentFromToolBar: any;

  constructor() { }

  ngOnInit() {
    this.hideUserContentFromToolBar = document.querySelector('.user-toolbar-row');
  };

  ngAfterViewInit() {
    this.hideUserContentFromToolBar.style.display = 'none';
  }


}
