import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../constants/tw_contants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  base_url = API_URL

  constructor(private http: HttpClient) { }

  post(url: string, body: any): Observable<any> {
    return this.http.post(`${this.base_url}${url}`, body, {
      withCredentials: true,
    });
  }

  get(url: string): Observable<any> {
    return this.http.get(`${this.base_url}${url}`, {
      withCredentials: true,
    });
  }

  getWithParams(url: string, opts: any): Observable<any> {
    return this.http.get(`${this.base_url}${url}`, {
      ...opts,
      "withCredentials": true,
    });
  }

  put(url: string, body: any): Observable<any> {
    return this.http.put(`${this.base_url}${url}`, body, {
      withCredentials: true,
    });
  }

  delete(url: string, opts: any): Observable<any> {
    return this.http.delete(`${this.base_url}${url}`, {
      ...opts, "withCredentials": true
    });
  }
}
