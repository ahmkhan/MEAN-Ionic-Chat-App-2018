import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AuthModule } from './customModules/AuthModule/auth.module';
import { AuthRoutingModule } from './customModules/AuthModule/auth-routing.module';
import { StreamModule } from './customModules/StreamModule/stream.module';
import { StreamRoutingModule } from './customModules/StreamModule/stream-routing.module';

import { SpinnerService } from './services/spinner.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AuthRoutingModule,
    StreamModule,
    StreamRoutingModule
  ],
  providers: [SpinnerService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
