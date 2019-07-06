import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import {SpinnerService} from '../../services/spinner.service';
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
  socketIO: any;
  userDetails: any;
  userDataObj: any;

  constructor(private peopleService: PeopleService, private tokenService: TokenService, private router: Router, private spinnerService: SpinnerService) {
    this.socketIO = io('http://localhost:4000');
  }

  ngOnInit() {
    this.userDetails = this.tokenService.getPayload();
    this.getPeopleByUserName();

    this.socketIO.on('refreshPage', () => {
      this.getPeopleByUserName();
    });
  };


  getPeopleByUserName() {
    this.peopleService.getPeoples_UsersByUserName(this.userDetails.data.UserName).then((success: any) => {
      success.subscribe((userByUserName:any) => {
        console.log('ggggg', userByUserName)
        if (userByUserName.status) {
            this.userDataObj = userByUserName.Users;
        }
      }, (errByUserName) => {
        console.log('error on Get User by UserName during subscribe', errByUserName);
      });
    }, (err) => {
      console.log('error on Get User by UserName', err);
    });
  };

}
