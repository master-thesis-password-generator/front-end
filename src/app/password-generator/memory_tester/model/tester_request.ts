export class TesterRequest {
  random_characters_password: string;
  random_words_password: string;
  song_password: string;
  email: string;

  constructor(random_words_password: string, song_password: string, email: string) {
    this.random_words_password = random_words_password;
    this.song_password = song_password;
    this.email = email;
  }
}
