import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import {SpinnerService} from '../../services/spinner.service';
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
  snackBarConfig: any;
  snackBarMessage:string[] = [];
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
    this.getPeopleByIdFollowing();

    this.socketIO.on('refreshPage', () => {
      this.getPeopleByIdFollowing();
    });
  }

    getPeopleByIdFollowing() {
    this.peopleService.getPeoples_UsersById(this.loggedInUser.data._id).then((success: any) => {
      success.subscribe((userById:any) => {
        if (userById.status) {
          if (userById.Users.UserFollowing.length) {
            this.usersArr = userById.Users.UserFollowing;
          }
          else {
            if (!this.emitCall) {
              this.snackBarMessage.push('You have not Following any User yet');
              this.displaySnackbar();
            }
          }
        }
      }, (errById) => {
        console.log('error on Get User by Id during subscribe', errById);
      });
    }, (err) => {
      console.log('error on Get User by Id', err);
    });
  };


  unFollowUserBtn(people: any) {
    this.spinnerService.showSpinner(true);

    this.peopleService.unFollowUserMethod(people._id).subscribe((success: any) => {
      if (success.status) {
        this.snackBarMessage.push(success.message);
        this.displaySnackbar();
        setTimeout(() => {
          this.usersArr = [];
          this.emitCall = true;
          this.socketIO.emit('refresh', {});
          this.spinnerService.showSpinner(false);
        }, 2000);
      }
    }, (err) => {
      console.log('err', err);
      this.snackBarMessage.push(err.message);
      this.displaySnackbar();
      setTimeout(() => {
        this.spinnerService.showSpinner(false);
      }, 2000);
    });
  };


  private displaySnackbar(): void {
    let nextMessage = this.getNextMessage();

    if(!nextMessage){
      return;
    }

    this.popupMsg.open(nextMessage, undefined, this.snackBarConfig)
      .afterDismissed()
      .subscribe(() => {
        nextMessage = undefined;
        this.displaySnackbar();
      });
  };

  private getNextMessage(): string | undefined {
    return this.snackBarMessage.length ? this.snackBarMessage.shift() : undefined;
  };

}
