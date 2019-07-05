import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import {SpinnerService} from '../../services/spinner.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  loggedInUser: any;
  usersArr: any;
  socketIO: any;
  snackBarConfig: any;
  snackBarMessage: string[] = ['You Have No Followers'];

  constructor(private peopleService: PeopleService, private tokenService: TokenService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService) {
    this.socketIO = io('http://localhost:4000');
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.panelClass = ['custom-class'];
    this.snackBarConfig.duration = 2000;
    this.snackBarConfig.verticalPosition = 'top';
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getPeopleByIdFollowers();

    this.socketIO.on('refreshPage', () => {
      this.getPeopleByIdFollowers();
    });
  }

  getPeopleByIdFollowers() {
    this.peopleService.getPeoples_UsersById(this.loggedInUser.data._id).then((success: any) => {
      success.subscribe((userById:any) => {
        if (userById.status) {
          if (userById.Users.UserFollowers.length) {
            this.usersArr = userById.Users.UserFollowers;
          }
          else {
            this.usersArr = [];
            this.displaySnackbar();
          }
        }
      }, (errById) => {
        console.log('error on Get User by Id during subscribe', errById);
      });
    }, (err) => {
      console.log('error on Get User by Id', err);
    });
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

}
