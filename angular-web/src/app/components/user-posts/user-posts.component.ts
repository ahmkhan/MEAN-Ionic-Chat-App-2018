import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  userPostsArray: any;
  socketIO: any;

  constructor(private postService: PostService) {
    this.socketIO = io('http://localhost:4000');
   }

  ngOnInit() {
    this.userAllPosts();
    this.socketIO.on('refreshPage', data => {
      this.userAllPosts();
    });  
  }

  userAllPosts() {
    this.userPostsArray = [];
    this.postService.getUserPosts().subscribe((posts: any) => {
      if (posts.userPosts && posts.userPosts.length) {
        this.userPostsArray = posts.userPosts;
      }
      else {
        console.log(' No User Posts Found');
      }
    });
  };

  timeFromNowConvert(time: any) {
    return moment(time).fromNow();
  };

}
