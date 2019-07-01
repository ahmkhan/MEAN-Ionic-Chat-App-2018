import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import {SpinnerService} from '../../services/spinner.service';
import _ from 'lodash';
import io from 'socket.io-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  allPeoplesArray: any;
  loggedInUser: any;
  usersArr: any;
  socketIO: any;

  constructor(private peopleService: PeopleService, private tokenService: TokenService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService) {
    this.socketIO = io('http://localhost:4000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getAllPeoples();
    this.getPeopleById();

    this.socketIO.on('refreshPage', () => {
      this.getAllPeoples();
      this.getPeopleById();
    });
  }

  getAllPeoples() {
    this.peopleService.getAllPeoples_Users().then((peopleData) => {
      peopleData.subscribe((finalPeopleData: any) => {
        _.remove(finalPeopleData.Users, {UserName: this.loggedInUser.data.UserName});
        this.allPeoplesArray = finalPeopleData.Users;
      }, (finalErr) => {
        console.log('finalErr', finalErr);
      });
    }, (err) => {
      console.log('err', err);
    });
  };

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


  followUserBtn(people: any) {
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.panelClass = ['custom-class'];
    snackBarConfig.duration = 2000;
    snackBarConfig.verticalPosition = 'top';

    this.spinnerService.showSpinner(true);

    this.peopleService.followUserMethod(people._id).subscribe((success: any) => {
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


  checkUserInArray(arr, userId) {
    const result = _.find(arr, ['UserFollowed._id', userId]);
    if (result) {
      return true;
    }
    else {
      return false;
    }
  };

}
