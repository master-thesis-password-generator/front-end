import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RCResponse } from './model/rcresponse';
import { RCModel } from './model/rcmodel';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class RCService {

  constructor(private http: HttpClient) { }

  getRandomCharactersPassword(url: string, data: RCModel) {
    return this.http.post<RCResponse>(url.concat('/random/characters'), data, httpOptions)
      .pipe(
        catchError(this.handleErrorObservable)
      );
  }

  private handleErrorObservable (error: Response | any) {
    console.error(error.message || error);
    return throwError(error.message || error);
  }
}
