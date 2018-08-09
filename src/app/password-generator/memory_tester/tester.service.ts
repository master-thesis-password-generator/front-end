import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TesterRequest } from './model/tester_request';
import { catchError } from 'rxjs/internal/operators';
import { throwError } from 'rxjs/index';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class TesterService {

  constructor(private http: HttpClient) { }

  sendTestData(url: string, data: TesterRequest) {
    return this.http.post<Boolean>(url.concat('/test/schedule'), data, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      );
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return throwError(error.message || error);
  }
}
