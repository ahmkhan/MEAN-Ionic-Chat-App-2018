import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {TokenService} from '../../services/token.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';


@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {
  userPostsArray: any;
  socketIO: any;
  userDetails: any;

  constructor(private postService: PostService, private tokenService: TokenService) {
    this.socketIO = io('http://localhost:4000');
   }

  ngOnInit() {
    this.userDetails = this.tokenService.getPayload();
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

  likePost(post, event) {
    this.postService.likePost(post).subscribe((like: any) => {
      if (like.status) {
        this.socketIO.emit('refresh', {});
      }
    }, (err) => {
      console.log('err', err);
    });
  };

  checkUserExistsInLikeArray(arr, user) {
    return _.some(arr, {UserName: user});
  };

  timeFromNowConvert(time: any) {
    return moment(time).fromNow();
  };

}
