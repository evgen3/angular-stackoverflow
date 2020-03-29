import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get logoutVisible() {
    return !!this.authService.accessToken;
  }

  onLogoutClick() {
    this.authService.accessToken = '';
    this.router.navigate(['/auth']);
  }
}
