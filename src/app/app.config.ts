import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from "@angular/common/http";

import { routes } from './app.routes';
import { bootstrapApplication } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './pages/login/login.component';
import { HttpTokenInterceptor } from './services/interceptor/http-token.interceptor';
import { ErrorInterceptorService } from './services/interceptor/ErrorInterceptorService';


export const appConfig: ApplicationConfig = {
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpTokenInterceptor,
    multi: true
  },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },

    importProvidersFrom(HttpClientModule),provideRouter(routes), provideHttpClient(), provideAnimationsAsync()]
};

