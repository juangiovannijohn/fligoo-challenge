import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.startsWith('http') || request.url.startsWith('https')) {
      return next.handle(request);
    }

    const apiRequest = request.clone({
      url: `${environment.apiUrl}${request.url}`,
      setHeaders: {
        'x-api-key': 'reqres-free-v1'
      }
    });

    return next.handle(apiRequest);
  }
}
