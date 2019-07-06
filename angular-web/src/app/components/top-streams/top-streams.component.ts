import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {PostService} from '../../services/post.service';
import {TokenService} from '../../services/token.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import {SpinnerService} from '../../services/spinner.service';
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  userTopPostsArray: any;
  socketIO: any;
  userDetails: any;

  constructor(private postService: PostService, private tokenService: TokenService, private router: Router, private spinnerService: SpinnerService) {
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
    this.postService.getUserPosts().subscribe((posts: any) => {
      if (posts.userTopPosts && posts.userTopPosts.length) {
        this.userTopPostsArray = posts.userTopPosts;
      } else {
        console.log('No User Posts Found');
        this.userTopPostsArray = [];
      }
    }, (err) => {
      console.log('err', err);
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

  openCommentsPage(posts) {
    this.router.navigate(['comments/' + posts._id]);
  };

}
