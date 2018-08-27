import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators';
import { throwError } from 'rxjs/index';
import { PGToastrService } from '../commons/toastr/pgtoastr.service';
import { Lyrics } from './model/lyrics';
import { RWFSRequest } from './model/rwfsrequest';
import { RWResponse } from "../random_words/model/rwresponse";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class SongsService {

  constructor(private http: HttpClient, private toastr: PGToastrService) { }

  getSongWordsPassword(url: string, data: RWFSRequest) {
    return this.http.post<RWResponse>(url.concat('/random/song'), data, httpOptions)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getLyrics(url: string, artistName: string) {
    return this.http.get<Lyrics>(url.concat('/random/lyrics/', artistName), httpOptions)
      .pipe(
        catchError(this.handleSongFetchingError.bind(this))
      );
  }

  private handleError (error: Response | any) {
    console.error(error.error || error);
    this.toastr.error(
      'Error during password creation. Check logs for more information',
      'Password creation failed'
    );
    return throwError(error.message || error);
  }

  private handleSongFetchingError (error: Response | any) {
    console.error(error.error || error);
    this.toastr.error(
      'Problems during getting song\'s lyrics. Check the artist\'s songs on lyrics.wikia and try one more time or change the artist.',
      'Cannot get song lyrics'
    );
    return throwError(error.message || error);
  }
}
