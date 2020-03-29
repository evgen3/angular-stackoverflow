import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const duration = 5000;
const errorTitle = 'Error';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  constructor(
    private snackBar: MatSnackBar
  ) { }

  show(message: string, action?: string) {
    this.snackBar.open(message, action, { duration });
  }

  showError(message: string, name?: string) {
    const action = `${errorTitle}${name ? `: ${name}` : ''}`;
    this.show(message, action);
  }
}
