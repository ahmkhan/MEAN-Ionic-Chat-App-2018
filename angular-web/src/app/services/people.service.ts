import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  BASEURL:string = 'http://localhost:4000/api/chatapp';

  constructor(private http: HttpClient) { }

  //Like This you have to subscribe to get Data
  // getAllPeoples_Users(): Observable<any> {
  //   return this.http.get(`${this.BASEURL}/post/get-all-users`);
  // };

  //Like This you have to .then and then use .subscribe to get Data
  async getAllPeoples_Users() {
    return await this.http.get(`${this.BASEURL}/people/getAllUsers`);
  };

  async getPeoples_UsersById(id: any) {
    return await this.http.get(`${this.BASEURL}/people/${id}`);
  };

  async getPeoples_UsersByUserName(userNme: any) {
    return await this.http.get(`${this.BASEURL}/people/${userNme}`);
  };


  followUserMethod(userFollowId: any) {
    return this.http.post(`${this.BASEURL}/people/followUser`, {userFollowedId: userFollowId})
  };


  unFollowUserMethod(userFollowId: any) {
    return this.http.post(`${this.BASEURL}/people/unFollowUser`, {userFollowedId: userFollowId})
  };


}
