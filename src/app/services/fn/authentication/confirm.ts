import { AuthenticationResponse } from './../../models/authentication-response';
/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';




export interface Confirm$Params {
  codigo: string;
}

export function confirm(http: HttpClient, rootUrl: string, params: Confirm$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
  const rb = new RequestBuilder(rootUrl, confirm.PATH, 'get');
  if (params) {
    rb.query('codigo', params.codigo, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return  r as StrictHttpResponse<AuthenticationResponse>;
    })
  );
}

confirm.PATH = 'api/auth/verificar-codigo-acesso';
