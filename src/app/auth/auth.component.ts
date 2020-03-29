import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    if (this.authService.accessToken) {
      this.goToMainPage();
    }
  }

  goToMainPage() {
    this.router.navigate(['']);
  }

  onClickButton() {
    this.authService.getAccessToken()
      .subscribe(accessToken => this.ngZone.run(() => {
        this.authService.accessToken = accessToken;
        this.goToMainPage();
      }));
  }
}
