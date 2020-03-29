import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotifyService } from '../shared/notify.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notifyService: NotifyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    const isServerError = !(error.error instanceof ErrorEvent);

    if (isServerError) {
      this.notifyService.showError(
        error?.error?.error_message ?? error.message,
        error?.error?.error_name
      );
    }

    return throwError(error);
  }
}
