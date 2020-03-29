import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface InitOptions {
  clientId: number;
  key: string;
  channelUrl: string;
  complete(): void;
}

interface AuthenticateResponse {
  accessToken: string;
}

interface AuthenticateOptions {
  scope?: string[];
  networkUsers?: boolean;
  success(response: AuthenticateResponse): void;
}

interface StackExchange {
  init(options: InitOptions): void;
  authenticate(options: AuthenticateOptions): void;
}

const src = 'https://api.stackexchange.com/js/2.0/all.js';
const clientId = 17537;
const key = 'utYJOa3rLYeFW9j*V)vxfw((';
const accessTokenKey = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  loadStackExchange() {
    return new Observable(subscriber => {
      const script = document.createElement('script');

      script.onload = () => {
        subscriber.next();
        subscriber.complete();
      };

      script.src = src;
      document.head.appendChild(script);
    });
  }

  getStackExchange(): Observable<StackExchange> {
    const { SE } =  window as any;

    if (SE) {
      return of(SE);
    }

    return this.loadStackExchange()
      .pipe(
        map(() => (window as any).SE)
      );
  }

  initStackExchange() {
    return this.getStackExchange()
      .pipe(
        switchMap(stackExchange => new Observable<StackExchange>(subscriber => {
          stackExchange.init({
            clientId,
            key,
            channelUrl: window.location.origin,
            complete() {
              subscriber.next(stackExchange);
              subscriber.complete();
            }
          });
        }))
      );
  }

  getAccessToken() {
    return this.initStackExchange()
      .pipe(
        switchMap(stackExchange => new Observable<string>(subscriber => {
          stackExchange.authenticate({
            networkUsers: true,
            success: ({ accessToken }) => {
              subscriber.next(accessToken);
              subscriber.complete();
            },
          });
        }))
      );
  }

  set accessToken(token) {
    localStorage.setItem(accessTokenKey, token ?? '');
  }

  get accessToken() {
    return localStorage.getItem(accessTokenKey);
  }
}
