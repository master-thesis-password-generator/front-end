import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { RCService } from './random_characters/rc.service';
import { RCModel } from './random_characters/model/rcmodel';
import { RCResponse } from './random_characters/model/rcresponse';
import { CommonsService } from './commons/commons.service';
import { RWResponse } from './random_words/model/rwresponse';
import { RWRequest } from './random_words/model/rwrequest';
import { RWService } from './random_words/rw.service';
import { RandomCharactersCookieService } from './cookies/characters/random-characters-cookie.service';
import { RandomWordsCookieService } from './cookies/words/random-words-cookie.service';
import { SongsCookieService } from './cookies/songs/songs-cookie.service';
import { SongsService } from './random_words_from_songs/songs.service';
import { TesterService } from './memory_tester/tester.service';
import { TesterRequest } from './memory_tester/model/tester_request';
import { PGToastrService } from './commons/toastr/pgtoastr.service';
import { environment } from '../../environments/environment';
import { Lyrics } from './random_words_from_songs/model/lyrics';
import { RWFSRequest } from './random_words_from_songs/model/rwfsrequest';

@Component({
  selector: 'password-generator',
  templateUrl: './password-generator.component.html',
  styleUrls: ['./password-generator.component.css']
})

export class PasswordGeneratorComponent implements OnInit {
  apiLocation: string;
  loading: boolean;

  /**
   * Password built from random characters from user-defined characters
   */

  rc_form: FormGroup;
  rc_character_groups: FormArray;
  rc_show_generation_results: boolean;
  rc_password_alert_type: string;
  rc_password: RCResponse;

  /**
   * Password created from random words with user-defined character mappings.
   */

  rw_form: FormGroup;
  rw_character_mappings: FormArray;
  rw_show_generation_results: boolean;
  rw_password_alert_type: string;
  rw_password: RWResponse;

  /**
   * Password created from words from song lyrics with character mappings.
   */

  rwfs_form: FormGroup;
  rwfs_character_mappings: FormArray;
  rwfs_show_generation_results: boolean;
  rwfs_show_generate_password_phase: boolean;
  rwfs_password_alert_type: string;
  rwfs_password: RWResponse;
  rwfs_song_lyrics: Lyrics;
  rwfs_lyrics_lines: Set<string> = new Set<string>();

  /**
   * Memory testing
   */
  test_form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private rcService: RCService,
              private rwService: RWService,
              private songsService: SongsService,
              private rcCookieService: RandomCharactersCookieService,
              private rwCookieService: RandomWordsCookieService,
              private rwfsCookieService: SongsCookieService,
              private testerService: TesterService,
              private toastr: PGToastrService) {
  }

  ngOnInit() {
    // Random characters
    this.rc_form = this.rcCookieService.getCookie();
    this.rc_character_groups = this.rc_form.get('character_groups') as FormArray;

    // Random words
    this.rw_form = this.rwCookieService.getCookie();
    this.rw_character_mappings = this.rw_form.get('character_mappings') as FormArray;

    // Random words from songs
    this.rwfs_form = this.rwfsCookieService.getCookie();
    this.rwfs_character_mappings = this.rwfs_form.get('character_mappings') as FormArray;

    this.test_form = this.createTestForm();
    this.apiLocation = environment.apiLocation;
  }

  createRCCharacterGroups(): FormGroup {
    return this.formBuilder.group({
      value: ''
    });
  }

  addRCCharacterGroup(): void {
    this.rc_character_groups.push(this.createRCCharacterGroups());
  }

  removeRCCharacterGroup(index: number): void {
    if (this.rc_character_groups.length  > 1) {
      this.rc_character_groups.removeAt(index);
    } else {
      console.warn('At least one character group required');
    }
  }

  onRCSubmit() {
    if (this.rc_form.valid) {
      this.turnLoadingOn();
      const formControl = this.rc_form.get('password_length') as FormControl;
      const data = new RCModel(
        this.rc_character_groups.getRawValue(),
        formControl.value
      );
      this.rcService.getRandomCharactersPassword(this.apiLocation, data).subscribe(rcResult => {
        this.rc_password = rcResult;
        this.rc_show_generation_results = true;
        const estimatedCrackingTime = Number(rcResult.crackingTime);
        if (estimatedCrackingTime < CommonsService.MEDIUM_PASSWORD_CRACKING_TIME) {
          this.rc_password_alert_type = 'danger';
        } else if (estimatedCrackingTime >= CommonsService.MEDIUM_PASSWORD_CRACKING_TIME &&
          estimatedCrackingTime < CommonsService.STRONG_PASSWORD_CRACKING_TIME) {
          this.rc_password_alert_type = 'warning';
        } else {
          this.rc_password_alert_type = 'success';
        }
        this.turnLoadingOff();
      }, err => {
        this.turnLoadingOff();
        this.toastr.error('Something went wrong, please try again!', 'Error');
      });
      this.rcCookieService.setCookie(this.rc_form);
    }
  }

  createRWCharacterMappings(): FormGroup {
    return this.formBuilder.group({
      character: ['', Validators.required],
      mapping: ['', Validators.required],
      chance: [50, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addRWCharacterGroup(): void {
    this.rw_character_mappings.push(this.createRWCharacterMappings());
  }

  removeRWCharacterGroup(index: number): void {
    if (this.rw_character_mappings.length  > 1) {
      this.rw_character_mappings.removeAt(index);
    } else {
      console.warn('At least one character group required');
    }
  }

  onRWSubmit() {
    if (this.rw_form.valid) {
      this.turnLoadingOn();
      const formControl = this.rw_form.get('password_length') as FormControl;
      const caseMode = this.rw_form.get('rwCase') as FormControl;
      const data = new RWRequest(
        this.rw_character_mappings.getRawValue(),
        formControl.value,
        caseMode.value
      );
      this.rwService.getRandomWordsPassword(this.apiLocation, data).subscribe(rwResult => {
        this.rw_password = this.parseRWResults(rwResult);
        this.rw_show_generation_results = true;
        const estimatedCrackingTime = Number(rwResult.crackingTime);
        if (estimatedCrackingTime < CommonsService.MEDIUM_PASSWORD_CRACKING_TIME) {
          this.rw_password_alert_type = 'danger';
        } else if (estimatedCrackingTime >= CommonsService.MEDIUM_PASSWORD_CRACKING_TIME &&
          estimatedCrackingTime < CommonsService.STRONG_PASSWORD_CRACKING_TIME) {
          this.rw_password_alert_type = 'warning';
        } else {
          this.rw_password_alert_type = 'success';
        }
        this.test_form.patchValue({
          random_words: this.rw_password.password
        });
        this.turnLoadingOff();
        this.toastr.success('This password will be used in the memory test. ' +
          'Please try to remember it and don\'t forget about generating a password using song\'s lyrics and participate in a test.',
          'Password generated successfully!');
      }, err => {
        this.turnLoadingOff();
        this.toastr.error('Something went wrong, please try again!', 'Error');
      });
      this.rwCookieService.setCookie(this.rw_form);
    }
  }

  getRandomColor() {
    let color = Math.floor(0x1000000 * Math.random());
    // When color too close to white -> move it to darker colors.
    if (color > 0xC8C8C8) {
      color -= 0x373737;
    }
    return '#' + ('000000' + color.toString()).slice(-6);
  }

  parseRWResults(rwResponse: any): RWResponse {
    const colors = [];
    for (let i = 0; i < rwResponse.usedWords.length; i++) {
      colors.push(this.getRandomColor());
    }
    return new RWResponse(rwResponse.passwordWords,
                          rwResponse.crackingTime,
                          rwResponse.usedWords,
                          colors,
                          rwResponse.passwordWords.reduce((previousValue, currentValue) => previousValue + currentValue, ''),
                          rwResponse.isSafe);
  }

  onGetLyricsSubmit() {
    const artist = this.rwfs_form.get('artist') as FormControl;
    this.turnLoadingOn();
    this.rwfs_lyrics_lines.clear();
    if (artist.value) {
      this.songsService.getLyrics(this.apiLocation, artist.value).subscribe(lyrics => {
        this.rwfs_song_lyrics = lyrics;
        this.rwfs_show_generate_password_phase = true;
        this.turnLoadingOff();
      }, err => {
        this.turnLoadingOff();
        this.rwfs_show_generate_password_phase = false;
      });
    }
  }

  onRWFSSubmit() {
    if (this.rwfs_form.valid) {
      this.turnLoadingOn();
      const caseMode = this.rwfs_form.get('rwfsCase') as FormControl;
      const lyricsLine = this.rwfs_form.get('lyricsLine') as FormControl;
      const data = new RWFSRequest(
        this.rwfs_character_mappings.getRawValue(),
        caseMode.value,
        lyricsLine.value
      );
      this.songsService.getSongWordsPassword(this.apiLocation, data).subscribe(rwResult => {
        this.rwfs_password = this.parseRWFSResults(rwResult);
        this.rwfs_show_generation_results = true;
        const estimatedCrackingTime = Number(rwResult.crackingTime);
        if (estimatedCrackingTime < CommonsService.MEDIUM_PASSWORD_CRACKING_TIME) {
          this.rwfs_password_alert_type = 'danger';
        } else if (estimatedCrackingTime >= CommonsService.MEDIUM_PASSWORD_CRACKING_TIME &&
          estimatedCrackingTime < CommonsService.STRONG_PASSWORD_CRACKING_TIME) {
          this.rwfs_password_alert_type = 'warning';
        } else {
          this.rwfs_password_alert_type = 'success';
        }
        this.test_form.patchValue({
          words_from_song: this.rwfs_password.password
        });
        this.turnLoadingOff();
        this.toastr.success('This password will be used in the memory test. ' +
          'Please try to remember it and don\'t forget about generating a password using random words and participate in a test.',
          'Password generated successfully!');
      }, err => {
        this.turnLoadingOff();
        this.toastr.error('Something went wrong, please try again!', 'Error');
      });
      this.rwfsCookieService.setCookie(this.rwfs_form);
    }
  }

  parseRWFSResults(rwResponse: any): RWResponse {
    const colors = [];
    for (let i = 0; i < rwResponse.usedWords.length; i++) {
      colors.push(this.getRandomColor());
    }
    return new RWResponse(
      rwResponse.passwordWords,
      rwResponse.crackingTime,
      rwResponse.usedWords,
      colors,
      rwResponse.passwordWords.reduce((previousValue, currentValue) => previousValue + currentValue, ''),
      rwResponse.isSafe);
  }

  addRWFSCharacterGroup(): void {
    this.rwfs_character_mappings.push(this.createRWCharacterMappings());
  }

  removeRWFSCharacterGroup(index: number): void {
    if (this.rwfs_character_mappings.length  > 1) {
      this.rwfs_character_mappings.removeAt(index);
    } else {
      console.warn('At least one character group required');
    }
  }

  private createTestForm() {
    return this.formBuilder.group({
      random_words: ['', Validators.required],
      words_from_song: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendTestData() {
    if (this.test_form.valid) {
      this.turnLoadingOn();
      const randomWords = this.test_form.get('random_words') as FormControl;
      const wordsFromSong = this.test_form.get('words_from_song') as FormControl;
      const email = this.test_form.get('email') as FormControl;
      const data = new TesterRequest(randomWords.value, wordsFromSong.value, email.value);

      this.testerService.sendTestData(this.apiLocation, data).subscribe(result => {
        console.log(result);
        this.toastr.success('Test scheduled successfully. Please check your mail for more info.',
                            'Thank you!');
        this.test_form = this.createTestForm();
        this.turnLoadingOff();
      }, err => {
        console.error(err);
        this.toastr.error('Something went wrong, please retry or contact the author.',
                          'Error!');
        this.turnLoadingOff();
      });
    }
  }

  getEffectiveLineLength(line: string): number {
    return line.replace(/\s/g, '').length;
  }

  wasLyricsLineUsed(line: string, isLast: any): boolean {
    let result = false;
    if (this.rwfs_lyrics_lines.has(line)) {
      result = true;
    } else {
      this.rwfs_lyrics_lines.add(line);
    }
    if (isLast) {
      this.clearLyricsLineCheck();
    }

    return result;
  }

  clearLyricsLineCheck() {
    this.rwfs_lyrics_lines.clear();
  }

  turnLoadingOn() {
    this.loading = true;
  }

  turnLoadingOff() {
    this.loading = false;
  }
}
