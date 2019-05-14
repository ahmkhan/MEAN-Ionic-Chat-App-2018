import { Component, OnInit } from '@angular/core';
import {PeopleService} from '../../services/people.service';
import {TokenService} from '../../services/token.service';
import _ from 'lodash';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  allPeoplesArray: any;
  loggedInUser: any;

  constructor(private peopleService: PeopleService, private tokenService: TokenService) { }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getAllPeoples();
  }

  getAllPeoples() {
    this.peopleService.getAllPeoples_Users().then((peopleData) => {
      peopleData.subscribe((finalPeopleData: any) => {
        _.remove(finalPeopleData.Users, {UserName: this.loggedInUser.data.UserName})
        this.allPeoplesArray = finalPeopleData.Users;
      }, (finalErr) => {
        console.log('finalErr', finalErr);
      }) 
    }, (err) => {
      console.log('err', err);
    });
  };

}
