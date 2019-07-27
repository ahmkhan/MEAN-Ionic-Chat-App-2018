import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
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
  snackBarConfig: any;

  constructor(private peopleService: PeopleService, private tokenService: TokenService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService, private router: Router) {
    this.socketIO = io('http://localhost:4000');
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.panelClass = ['custom-class'];
    this.snackBarConfig.duration = 2000;
    this.snackBarConfig.verticalPosition = 'top';
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getAllPeoples();
    this.getPeopleByIdPeople();

    this.socketIO.on('refreshPage', () => {
      this.getAllPeoples();
      this.getPeopleByIdPeople();
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

  getPeopleByIdPeople() {
    this.peopleService.getPeoples_UsersById(this.loggedInUser.data._id).then((success: any) => {
      success.subscribe((userById:any) => {
        if (userById.status) {
          if (userById.Users.UserFollowing.length) {
            this.usersArr = userById.Users.UserFollowing;
          }
          else {
            this.usersArr = [];
          }
        }
      }, (errById) => {
        console.log('error on Get User by Id during subscribe', errById);
      });
    }, (err) => {
      console.log('error on Get User by Id', err);
    });
  };


  followUserBtn(people: any) {
    this.spinnerService.showSpinner(true);
    this.peopleService.followUserMethod(people._id).subscribe((success: any) => {
      if (success.status) {
        this.popupMsg.open(success.message, '', this.snackBarConfig);
        setTimeout(() => {
          this.socketIO.emit('refresh', {});
          this.spinnerService.showSpinner(false);
        }, 2000);
      }
    }, (err) => {
      console.log('err', err);
      this.popupMsg.open(err.message, '', this.snackBarConfig);
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


  renderChatPage(userName) {
    this.router.navigate(['/chat', userName]);
  };

}
