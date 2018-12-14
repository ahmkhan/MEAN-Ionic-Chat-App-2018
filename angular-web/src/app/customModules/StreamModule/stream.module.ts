import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TokenService } from '../../services/token.service';

import { StreamComponent } from '../../components/stream/stream.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StreamComponent],
  exports: [StreamComponent],
  providers: [TokenService]
})
export class StreamModule { }
