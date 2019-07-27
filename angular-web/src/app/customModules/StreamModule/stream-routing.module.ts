import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { StreamComponent } from '../../components/stream/stream.component';
import { CommentsComponent } from '../../components/comments/comments.component';
import { PeopleComponent } from '../../components/people/people.component';
import {FollowingComponent} from "../../components/following/following.component";
import {FollowersComponent} from "../../components/followers/followers.component";
import {NotificatonsComponent} from "../../components/notificatons/notificatons.component";
import {ChatComponent} from "../../components/chat/chat.component";

const streamRoutes: Routes = [
  {path: 'streams', component: StreamComponent, canActivate: [AuthGuard]},
  {path: 'comments/:id', component: CommentsComponent, canActivate: [AuthGuard]},
  {path: 'people', component: PeopleComponent, canActivate: [AuthGuard]},
  {path: 'people/following', component: FollowingComponent, canActivate: [AuthGuard]},
  {path: 'people/followers', component: FollowersComponent, canActivate: [AuthGuard]},
  {path: 'notifications', component: NotificatonsComponent, canActivate: [AuthGuard]},
  {path: 'chat/:username', component: ChatComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(streamRoutes)],
  exports: [RouterModule]
})
export class StreamRoutingModule { }
