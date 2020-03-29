import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const errorTitle = 'Error';
const snackBarDuration = 5000;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    const isServerError = !(error.error instanceof ErrorEvent);

    if (isServerError) {
      this.showError(
        error?.error?.error_message ?? error.message,
        error?.error?.error_name
      );
    }

    return throwError(error);
  }

  private showError(message: string, name?: string) {
    const action = `${errorTitle}${name ? `: ${name}` : ''}`;

    this.snackBar.open(message, action, {
      duration: snackBarDuration
    });
  }
}
