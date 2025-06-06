import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private router: Router) {}

  private cameFromLogin: boolean = false;

  private navigatedFromMenu: boolean = false;


  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token') != 'undefined'
      ? (localStorage.getItem('token') as string)
      : null;
  }

  set tipoPermissao(tipo: string) {
    localStorage.setItem('tipo', tipo);
  }

  get tipoPermissao() {
    return localStorage.getItem('tipo') != 'undefined'
      ? (localStorage.getItem('tipo') as string)
      : null;
  }



  isTokenValid() {
    const token = this.token;
    if (!token) {
      return false;
    }
    // decode the token
    const jwtHelper = new JwtHelperService();
    // check expiry date
    const isTokenExpired = jwtHelper.isTokenExpired(token);
    if (isTokenExpired) {
      localStorage.clear();
      return false;
    }

    return true;
  }


  isTokenNotValid() {
    return !this.isTokenValid();
  }



  isAuthenticated(): boolean {
    return !!this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  setCameFromLogin(status: boolean): void {
    this.cameFromLogin = status;
  }

  getCameFromLogin(): boolean {
    return this.cameFromLogin;
  }

  setNavigatedFromMenu(status: boolean): void {
    this.navigatedFromMenu = status;
  }

  getNavigatedFromMenu(): boolean {
    return this.navigatedFromMenu;
  }

  logout(): void {
    this.token = null;
    this.cameFromLogin = false;
    this.navigatedFromMenu = false;
    this.router.navigate(['/']);
  }
}
