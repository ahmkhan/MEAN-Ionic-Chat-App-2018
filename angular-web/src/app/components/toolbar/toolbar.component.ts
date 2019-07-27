import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import * as moment from 'moment';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import {SpinnerService} from '../../services/spinner.service';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  userName: any;
  notificationsArr: any;
  socketIO: any;
  snackBarConfig: any;
  hasNotifications: boolean;
  countNotifications: any = [];
  chatListArr: any;
  msgNumber: number = 0;

  constructor(private tokenService: TokenService, private router: Router, private peopleService: PeopleService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService, private actRouter: ActivatedRoute) {
    this.socketIO = io('http://localhost:4000');
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.panelClass = ['custom-class'];
    this.snackBarConfig.duration = 2000;
    this.snackBarConfig.verticalPosition = 'top';
  }

  ngOnInit() {
    this.userName = this.tokenService.getPayload();
    this.getPeopleByUserNameNotifications();

    this.socketIO.on('refreshPage', () => {
      this.getPeopleByUserNameNotifications();
    });
  };

  logoutBtn() {
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  };

  goStreamPage() {
    this.router.navigate(['streams']);
  };

  getPeopleByUserNameNotifications() {
    this.peopleService.getPeoples_UsersByUserName(this.userName.data.UserName).then((success: any) => {
      success.subscribe((userByUserName:any) => {
        if (userByUserName.status) {
          if (userByUserName.Users.Notifications.length) {
            this.hasNotifications = true;
            this.notificationsArr = userByUserName.Users.Notifications.reverse();
            const countsValue = _.filter(this.notificationsArr, ['MsgRead', false]);
            this.countNotifications = countsValue;
          }
          else {
            this.notificationsArr = [];
            this.hasNotifications = false;
          }

          if (userByUserName.Users.ChatList.length) {
            this.chatListArr = userByUserName.Users.ChatList;
            this.checkMessageReadMethod(this.chatListArr);
          }
          else {
            this.chatListArr = [];
          }
        }
      }, (errByUserName) => {
        console.log('error on Get User by UserName during subscribe', errByUserName);
        if (errByUserName.error && errByUserName.error.token == null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      });
    }, (err) => {
      console.log('error on Get User by UserName', err);
      if (err.error && err.error.token == null) {
        this.tokenService.deleteToken();
        this.router.navigate(['']);
      }
    });
  };


  checkMessageReadMethod(arr) {
    const checkingArr = [];
    for (let y = 0; y < arr.length; y++) {
      const receiver = arr[y].MessageId.Messages[arr[y].MessageId.Messages.length - 1];

      if (this.router.url != `/chat/${receiver.SenderUserName}`) {
        if (receiver.MsgIsRead == false && receiver.ReceiverUserName == this.userName.data.UserName) {
          checkingArr.push(1);
          this.msgNumber = _.sum(checkingArr);
        }
      }
    }
  };


  timeFromNowConvert(time: any) {
    return moment(time).fromNow();
  };


  markAllAsRead() {
    this.spinnerService.showSpinner(true);
    this.peopleService.MarkAllNotificationsAsRead().then((AllReadThen: any) => {
      AllReadThen.subscribe((AllReadSub) => {
        if (AllReadSub.status) {
          this.spinnerService.showSpinner(false);
          this.socketIO.emit('refresh', {});
        }
      }, (errSubscribe) => {
        this.spinnerService.showSpinner(false);
        console.log('err', errSubscribe);
      });
    }, (errThen) => {
      this.spinnerService.showSpinner(false);
      console.log('err', errThen);
    });
  };

}
