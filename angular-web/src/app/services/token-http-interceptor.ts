import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class TokenHttpInterceptor implements HttpInterceptor {
    constructor (private tokenService: TokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        const headerConfig = {
            'Content-Type'  :   'application/json',
            'Accept'        :   'application/json'
        };

        const token = this.tokenService.getToken();
        if (token) {
            headerConfig['Authorization']   =   `beader ${token}`;
        }
        const _req = req.clone({setHeaders: headerConfig});
        return next.handle(_req);
  }
}
