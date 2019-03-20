import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { StreamComponent } from '../../components/stream/stream.component';
import { CommentsComponent } from '../../components/comments/comments.component';

const streamRoutes: Routes = [
  {path: 'streams', component: StreamComponent, canActivate: [AuthGuard]},
  {path: 'comments/:id', component: CommentsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(streamRoutes)],
  exports: [RouterModule]
})
export class StreamRoutingModule { }
