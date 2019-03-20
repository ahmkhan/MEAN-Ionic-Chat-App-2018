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
    return this.http.post(`${this.BASEURL}/post/add-post`, postData);
  };

  getUserPosts() :Observable<any> {
    return this.http.get(`${this.BASEURL}/post/get-all-posts`);
  };

  likePost(post) :Observable<any> {
    return this.http.post(`${this.BASEURL}/post/like-post`, post);
  };

  addComment(commentWithPostIdObj) :Observable<any> {
    return this.http.post(`${this.BASEURL}/post/add-comment`, commentWithPostIdObj);
  };

  getSinglePost(id) :Observable<any> {
    return this.http.get(`${this.BASEURL}/post/${id}`);
  };

}
