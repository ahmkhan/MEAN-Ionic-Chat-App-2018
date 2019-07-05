import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import * as moment from 'moment';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import {SpinnerService} from '../../services/spinner.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-notificatons',
  templateUrl: './notificatons.component.html',
  styleUrls: ['./notificatons.component.css']
})
export class NotificatonsComponent implements OnInit {
  loggedInUser: any;
  notificationsArr: any;
  socketIO: any;
  snackBarConfig: any;
  snackBarMessage: string[] = ['You have no Notifications'];
  emitCall: any;

  constructor(private peopleService: PeopleService, private tokenService: TokenService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService) {
    this.socketIO = io('http://localhost:4000');
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.panelClass = ['custom-class'];
    this.snackBarConfig.duration = 2000;
    this.snackBarConfig.verticalPosition = 'top';
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getPeopleByUserNameNotifications();

    this.socketIO.on('refreshPage', () => {
      this.getPeopleByUserNameNotifications();
    });
  };

  getPeopleByUserNameNotifications() {
    this.peopleService.getPeoples_UsersByUserName(this.loggedInUser.data.UserName).then((success: any) => {
      success.subscribe((userByUserName:any) => {
        if (userByUserName.status) {
          if (userByUserName.Users.Notifications.length) {
            this.notificationsArr = userByUserName.Users.Notifications.reverse();
          }
          else {
            this.notificationsArr = [];
            this.displaySnackbar();
          }
        }
      }, (errByUserName) => {
        console.log('error on Get User by UserName during subscribe', errByUserName);
      });
    }, (err) => {
      console.log('error on Get User by UserName', err);
    });
  };

  timeFromNowConvert(time: any) {
    return moment(time).fromNow();
  };


  private displaySnackbar(): void {
    const nextMessage = this.getNextMessage();

    if(!nextMessage){
      return;
    }

    this.popupMsg.open(nextMessage, undefined, this.snackBarConfig)
      .afterDismissed()
      .subscribe(() => {
        this.displaySnackbar();
      });
  };


  private getNextMessage(): string | undefined {
    return this.snackBarMessage.length ? this.snackBarMessage.shift() : undefined;
  };


  markNotificationAsRead(data) {
    this.peopleService.MarkOrDeleteNotification(data._id).subscribe((value: any) => {
      if (value.status) {
        this.emitCall = true;
        this.socketIO.emit('refresh', {});
      }
    }, (err) => {
      console.log('err', err);
    });
  };


  deleteNotification(data) {
    this.spinnerService.showSpinner(true);
    this.peopleService.MarkOrDeleteNotification(data._id, true).subscribe((value: any) => {
      if (value.status) {
          this.socketIO.emit('refresh', {});
          this.spinnerService.showSpinner(false);
      }
    }, (err) => {
      console.log('err', err);
    });
  };


}
