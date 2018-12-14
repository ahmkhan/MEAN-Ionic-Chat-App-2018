import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { StreamComponent } from '../../components/stream/stream.component';

const streamRoutes: Routes = [
  {path: 'streams', component: StreamComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(streamRoutes)],
  exports: [RouterModule]
})
export class StreamRoutingModule { }
