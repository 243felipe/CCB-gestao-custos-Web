import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.tokenService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }

    // Verifique se a navegação foi feita pelo menu
    if (!this.tokenService.getNavigatedFromMenu() && state.url !== '/dashboard') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
