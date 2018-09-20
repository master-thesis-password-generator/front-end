export class TesterRequest {
  randomWordsPassword: string;
  songPassword: string;
  email: string;

  constructor(random_words_password: string, songPassword: string, email: string) {
    this.randomWordsPassword = random_words_password;
    this.songPassword = songPassword;
    this.email = email;
  }
}
