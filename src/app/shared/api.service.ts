import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = '//api.stackexchange.com/2.2';
  site = 'stackoverflow';
  constructor() { }
}
