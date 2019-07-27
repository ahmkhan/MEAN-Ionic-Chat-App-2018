import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatCheckboxModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSidenavModule,
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatCardModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatDividerModule,
  MatTabsModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { EmojiPickerModule } from "ng2-emoji-picker";

import { TokenService } from '../../services/token.service';
import { PostService } from 'src/app/services/post.service';
import { MessagesService } from 'src/app/services/messages.service';

import { StreamComponent } from '../../components/stream/stream.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { SideComponent } from '../../components/side/side.component';
import { PostFormsComponent } from '../../components/post-forms/post-forms.component';
import { UserPostsComponent } from '../../components/user-posts/user-posts.component';
import { CommentsComponent } from '../../components/comments/comments.component';
import { PeopleComponent } from '../../components/people/people.component';
import { PeopleService } from 'src/app/services/people.service';
import { FollowingComponent } from '../../components/following/following.component';
import { FollowersComponent } from '../../components/followers/followers.component';
import { NotificatonsComponent } from '../../components/notificatons/notificatons.component';
import { TopStreamsComponent } from '../../components/top-streams/top-streams.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { MessagesComponent } from '../../components/messages/messages.component';


@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatDividerModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgxAutoScrollModule,
    EmojiPickerModule.forRoot()
  ],
  declarations: [StreamComponent, ToolbarComponent, SideComponent, PostFormsComponent, UserPostsComponent, CommentsComponent, PeopleComponent, FollowingComponent, FollowersComponent, NotificatonsComponent, TopStreamsComponent, ChatComponent, MessagesComponent],
  exports: [StreamComponent, ToolbarComponent, SideComponent, PostFormsComponent, UserPostsComponent, CommentsComponent, PeopleComponent],
  providers: [TokenService, PostService, PeopleService, MessagesService]
})
export class StreamModule { }
