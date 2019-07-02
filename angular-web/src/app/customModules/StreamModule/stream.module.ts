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

import { TokenService } from '../../services/token.service';
import { PostService } from 'src/app/services/post.service';

import { StreamComponent } from '../../components/stream/stream.component';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { SideComponent } from '../../components/side/side.component';
import { PostFormsComponent } from '../../components/post-forms/post-forms.component';
import { UserPostsComponent } from '../../components/user-posts/user-posts.component';
import { CommentsComponent } from '../../components/comments/comments.component';
import { PeopleComponent } from '../../components/people/people.component';
import { PeopleService } from 'src/app/services/people.service';
import { FollowingComponent } from '../../components/following/following.component';


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
    RouterModule
  ],
  declarations: [StreamComponent, ToolbarComponent, SideComponent, PostFormsComponent, UserPostsComponent, CommentsComponent, PeopleComponent, FollowingComponent],
  exports: [StreamComponent, ToolbarComponent, SideComponent, PostFormsComponent, UserPostsComponent, CommentsComponent, PeopleComponent],
  providers: [TokenService, PostService, PeopleService]
})
export class StreamModule { }
