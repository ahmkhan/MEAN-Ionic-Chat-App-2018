import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import {SpinnerService} from '../../services/spinner.service';
import _ from 'lodash';
import io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  loggedInUser: any;
  usersArr: any;
  socketIO: any;

  constructor(private peopleService: PeopleService, private tokenService: TokenService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService) {
    this.socketIO = io('http://localhost:4000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getPeopleById();

    this.socketIO.on('refreshPage', () => {
      this.getPeopleById();
    });
  }

  getPeopleById() {
    this.peopleService.getPeoples_UsersById(this.loggedInUser.data._id).then((success: any) => {
      success.subscribe((userById:any) => {
        this.usersArr = userById.Users.UserFollowing;
      }, (errById) => {
        console.log('error on Get User by Id during subscribe', errById);
      });
    }, (err) => {
      console.log('error on Get User by Id', err);
    });
  };


  unFollowUserBtn(people: any) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.panelClass = ['custom-class'];
    snackBarConfig.duration = 2000;
    snackBarConfig.verticalPosition = 'top';

    this.spinnerService.showSpinner(true);

    this.peopleService.unFollowUserMethod(people._id).subscribe((success: any) => {
      if (success.status) {
        this.socketIO.emit('refresh', {});
        this.popupMsg.open(success.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 2000);
      }
    }, (err) => {
      console.log('err', err);
      this.popupMsg.open(err.message, '', snackBarConfig);
      setTimeout(() => {
        this.spinnerService.showSpinner(false);
      }, 2000);
    });
  };


}
