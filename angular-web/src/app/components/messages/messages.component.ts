import {AfterViewInit, Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import * as moment from 'moment';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent, EmojiPickerOptions } from "ng2-emoji-picker";

import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import {SpinnerService} from '../../services/spinner.service';
import {MessagesService} from "../../services/messages.service";


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewInit {
  loggedInUser: any;
  socketIO: any;
  snackBarConfig: any;
  receiverUserName: any;
  receiverData: any;
  getMsgText: string;
  messagesArr: any = [];
  typingMessage: any;
  isTyping: boolean = false;

  public eventMock;
  public eventPosMock;
  public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public content = ' ';
  private _lastCaretEvent: CaretEvent;


  constructor(private msgService: MessagesService, private peopleService: PeopleService, private tokenService: TokenService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService, private actRoute: ActivatedRoute) {
    this.socketIO = io('http://localhost:4000');
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.panelClass = ['custom-class'];
    this.snackBarConfig.duration = 2000;
    this.snackBarConfig.verticalPosition = 'top';
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();

    this.actRoute.params.subscribe((routeParam: any) => {
      this.receiverUserName = routeParam.username;
      this.getPeopleByUserNameNotifications(this.receiverUserName);
    });

    this.socketIO.on('refreshPage', () => {
      this.getPeopleByUserNameNotifications(this.receiverUserName);
    });

    this.socketIO.on('is_typing', (data) => {
      if (data.sender == this.receiverUserName) {
        this.isTyping = true;
      }
    });

    this.socketIO.on('has_stop_typing', (data) => {
      if (data.sender == this.receiverUserName) {
        this.isTyping = false;
      }
    });
  };

  ngAfterViewInit() {
    const params = {
      room1: this.loggedInUser.data.UserName,
      room2: this.receiverUserName
    };

    this.socketIO.emit('join chat', params);
  };


  getPeopleByUserNameNotifications(receiverUserName) {
    this.peopleService.getPeoples_UsersByUserName(receiverUserName).then((success: any) => {
      success.subscribe((userByUserName:any) => {
        if (userByUserName.status) {
          this.receiverData = userByUserName.Users;
          this.getMessages(this.loggedInUser.data._id, this.receiverData._id);
        }
      }, (errByUserName) => {
        console.log('error on Get User by UserName during subscribe', errByUserName);
      });
    }, (err) => {
      console.log('error on Get User by UserName', err);
    });
  };


  getMessages(senderId, receiverId) {
    this.msgService.getMessagesServiceMethod(senderId, receiverId).subscribe((successGetMsg) => {
      this.messagesArr = successGetMsg.messages.Messages;
    }, (errGetMsg) => {
      console.log('errThenGetMsg', errGetMsg);
    });
  }


  sendMessages() {
    if (this.getMsgText == undefined || this.getMsgText == '') {
      this.popupMsg.open('Please Type Message', undefined, this.snackBarConfig);
      return;
    }
    this.msgService.sendMessagesServiceMethod(this.loggedInUser.data._id, this.loggedInUser.data.UserName, this.receiverData._id, this.receiverData.UserName, this.getMsgText).subscribe((sendMsgSuccess) => {
      this.socketIO.emit('refresh', {});
      this.getMsgText = '';
    }, (errInsendMsgSuccess) => {
      console.log('errInsendMsgSuccess', errInsendMsgSuccess)
    });
  };

  isUserTyping() {
    this.socketIO.emit('start_typing', {
      sender: this.loggedInUser.data.UserName,
      receiver: this.receiverUserName
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socketIO.emit('stop_typing', {
        sender: this.loggedInUser.data.UserName,
        receiver: this.receiverUserName
      });
    }, 500);
  };

  handleSelection(event: EmojiEvent) {
    this.content = this.content.slice(0, this._lastCaretEvent.caretOffset) + event.char + this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);

    this.getMsgText = this.getMsgText + this.content;
    this.content = '';
  };

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${event.textContent} }`;
  };

}
