import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  BASEURL:string = 'http://localhost:4000/api/chatapp';

  constructor(private http: HttpClient) { }

  addPost(postData) :Observable<any> {
    return this.http.post(`${this.BASEURL}/post/add-post`, postData)
  }
}
