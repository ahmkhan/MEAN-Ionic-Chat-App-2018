import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import * as moment from 'moment';
import io from 'socket.io-client';

import {PostService} from '../../services/post.service';
import {SpinnerService} from '../../services/spinner.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any;
  commentsArray: any = [];
  socketIO: any;
  userPost: any;

  constructor(private formBuilder: FormBuilder, private postService: PostService, private activatedRoute: ActivatedRoute, private popupMsg: MatSnackBar, private spinnerService: SpinnerService) {
    this.socketIO = io('http://localhost:4000');
  }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.user-toolbar-row');
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.createCommentForm();
    this.getSinglePostById();
    this.socketIO.on('refreshPage', data => {
      this.getSinglePostById();
    });
  };

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  };

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      Comment: ['', Validators.required]
    });
  };

  addComment() {
    let snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.panelClass = ['custom-class'];
    snackBarConfig.duration = 2000;
    snackBarConfig.verticalPosition = 'top';

    let commentWithPostIdObj = {};
    commentWithPostIdObj['PostId'] = this.postId;
    commentWithPostIdObj['Comment'] = this.commentForm.value.Comment;

    this.spinnerService.showSpinner(true);
    this.postService.addComment(commentWithPostIdObj).subscribe((commentData:any) => {
      if (commentData.status) {
        this.popupMsg.open(commentData.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
          this.commentForm.reset();
          this.socketIO.emit('refresh', {});
        }, 2000);
      }
      }, (err) => {
      console.log('err', err);
    });
  };


  getSinglePostById() {
    this.postService.getSinglePost(this.postId).subscribe((getPost: any) => {
      if (getPost.status) {
        this.commentsArray = getPost.post.Comments.reverse();
        this.userPost = getPost.post.Post;
      }
    }, (err) => {
      console.log('err', err);
    })
  };


  timeFromNowConvert(time: any) {
    return moment(time).fromNow();
  };

}
