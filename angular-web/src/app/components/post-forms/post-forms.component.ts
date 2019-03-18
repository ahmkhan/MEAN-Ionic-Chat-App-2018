import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

import io from 'socket.io-client';

import { PostService } from 'src/app/services/post.service';
import {SpinnerService} from '../../services/spinner.service';

@Component({
  selector: 'app-post-forms',
  templateUrl: './post-forms.component.html',
  styleUrls: ['./post-forms.component.css']
})
export class PostFormsComponent implements OnInit {
  imageName: any = null;
  postForm: FormGroup;
  socketIO: any;

  constructor(private formBuilder: FormBuilder, private postService: PostService, private popupMsg: MatSnackBar, private spinnerService: SpinnerService) {
    this.socketIO = io('http://localhost:4000');
  }

  ngOnInit() {
    this.createPostForm();
  }

  onFileSelected (event) {
    if (event.target.files.length > 0) {
      this.imageName = event.target.files[0].name;
    }
  };

  createPostForm() {
    this.postForm = this.formBuilder.group({
      Post: ['', Validators.required]
    });
  };

  addPost() {
    let snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.panelClass = ['custom-class'];
    snackBarConfig.duration = 2000;
    snackBarConfig.verticalPosition = 'top';

    this.spinnerService.showSpinner(true);

    this.postService.addPost(this.postForm.value).subscribe((postAdded :any) => {
      if (postAdded.message == 'Post Created Successfully') {
        this.popupMsg.open(postAdded.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
          this.postForm.reset();
          this.socketIO.emit('refresh', {});
        }, 2000);
      }
      
    }, (errorPost) => {
      if (errorPost.error.message == 'Error In Add Post Schema Validation') {
        this.popupMsg.open(errorPost.error.message + ', ' + errorPost.error.errorMsg[0].message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 2000);
      }
      
      if (errorPost.error.message == 'Server Error on Post Creation') {
        this.popupMsg.open(errorPost.error.message, '', snackBarConfig);
        setTimeout(() => {
          this.spinnerService.showSpinner(false);
        }, 2000);
      }
      console.log('errorPost', errorPost)
    }) 
  };

}
