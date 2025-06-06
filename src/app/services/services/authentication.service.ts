/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { authenticate } from '../fn/authentication/authenticate';
import { Authenticate$Params } from '../fn/authentication/authenticate';
import { AuthenticationResponse } from '../models/authentication-response';
import { confirm } from '../fn/authentication/confirm';
import { Confirm$Params } from '../fn/authentication/confirm';


@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `authenticate()` */
  static readonly AuthenticatePath = 'auth/authenticate';

  readonly testPath = 'api/v1/exemplo-controller';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate$Response(params: Authenticate$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return authenticate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `authenticate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate(params: Authenticate$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.authenticate$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>): AuthenticationResponse => r.body)
    );
  }

  /** Path part for operation `confirm()` */
  static readonly ConfirmPath = 'api/auth/verificar-codigo-acesso';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `confirm()` instead.
   *
   * This method doesn't expect any request body.
   */
  confirm$Response(params: Confirm$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return confirm(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `confirm$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  confirm(params: Confirm$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.confirm$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>): AuthenticationResponse => r.body)
    );
  }


  getData(context?: HttpContext): Observable<string> {
    const url = `${this.rootUrl}${this.testPath}`;
    const options = {
      headers: { 'Accept': 'application/json'
    }, // Adicione o cabeçalho 'Accept'
      withCredentials: true,
      context
    };

    return this.http.get<any>(url, options)
  }



  // validarUsuario(email: string, senha: string): Observable<boolean>{

  // const  options  = {
  //     headers: { 'Accept': 'application/json'
  //     }, // Adicione o cabeçalho 'Accept'
  //     withCredentials: false,
  //   };
  //   return this.http.get<boolean>(`${this.rootUrl}api/v1/valida-usuario-senha?email=${email}&senha=${senha}`, options)
  // }




  validarUsuario(email: string, senha: string, context?: HttpContext): Observable<any> {
    const url = `${this.rootUrl}api/auth/valida-usuario-senha?email=${email}&senha=${senha}`;

    return this.http.get(url, { context }).pipe(
      map((response: any) => response)
    );
  }




}
