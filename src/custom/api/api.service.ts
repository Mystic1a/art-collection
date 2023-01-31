import { API_CONFIG, ApiConfig } from './api.config';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl!: string;

  constructor(
    @Inject(API_CONFIG) @Optional() apiConfig: ApiConfig,
    private http: HttpClient
  ) {
    const baseUrl = apiConfig?.apiEndpoint || environment.baseUrl;
    this.baseUrl = baseUrl + '/api/v1';
  }

  requestHeader(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Accept-Language', 'en'); // * Base on EN
    return headers;
  }

  get<T>(url: string, params?: any, headers?: any): Observable<T> {
    return this.http.get<T>(this.baseUrl + url, {
      headers: headers ? headers : this.requestHeader(),
      params: this.getValidHttpParams({ ...params }),
    });
  }

  getValidHttpParams(params: { [name: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value == null) {
        return;
      }
      const isPrimitiveType = this.isPrimitiveType(value);
      const isArray = Array.isArray(value);
      if (isArray) {
        const isValidArray = (value as any[]).every((item) => {
          this.isPrimitiveType(item);
        });
        if (!isValidArray) {
          return;
        }
      } else if (!isPrimitiveType) {
        return;
      }
      httpParams = httpParams.append(key, value);
    });
    return httpParams;
  }

  isPrimitiveType(value: any): boolean {
    return ['boolean', 'number', 'string'].includes(typeof value);
  }
}
