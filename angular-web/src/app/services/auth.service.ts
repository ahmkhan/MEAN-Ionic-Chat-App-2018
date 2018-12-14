import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASEURL:string = 'http://localhost:4000/api/chatapp';
  
  constructor(private http: HttpClient) { }

  registerNewUserService (url, userObj): Observable<any> {
    return this.http.post(`${this.BASEURL + url}`, userObj)
  };
  
  loginUserService (url, userObj): Observable<any> {
    return this.http.post(`${this.BASEURL + url}`, userObj)
  };
}
