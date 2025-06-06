import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaultRequestsService {

  constructor(private http: HttpClient) {
  }

  options: any = {
    headers: { 'Accept': 'application/json'
    }, // Adicione o cabeçalho 'Accept'
    withCredentials: true,
  };

  public defaultGet(url: string): Observable<any> {
    return this.http.get<any>(url, this.options);
  }

  public defaultDelete(url: string): Observable<any> {
    return this.http.delete<any>(url, this.options);
  }

  public defaultPut(url: string, body: any): Observable<any> {
    return this.http.put<any>(url, body, this.options);
  }

  public defaultPost(url: string, body: any): Observable<any> {
    return this.http.post<any>(url, body, this.options);
  }

}
