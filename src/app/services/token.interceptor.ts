import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { TokenService } from './token.service';
import { Router } from '@angular/router';


/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private token;
  private expiration;
  constructor(private tokensService: TokenService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url;

    this.token = this.tokensService.getToken();
    this.expiration = this.tokensService.getExpirationDate();

    // Check token expiration
    if (new Date(this.expiration) < new Date() && this.expiration != null) {
      this.tokensService.clear();
      this.router.navigate(['/login']);
    }

    // Check if the URL matches any of the service URLs and the request is not an OPTIONS request
    if (
      (url.startsWith(environment.accountmanagement_url) ||
      url.startsWith(environment.stationmanagement_url) ||
      url.startsWith(environment.systemsupport_url) ||
      url.startsWith(environment.customorservice_url)) &&
      req.method !== 'OPTIONS' &&
      this.token != null
    ) {
      const request = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.token.access_token
        })
      });
      return next.handle(request);
    }

    return next.handle(req);
  }
}

