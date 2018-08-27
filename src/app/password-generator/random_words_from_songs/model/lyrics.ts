export class Lyrics {
  lyrics: string[];
  song_name: string;

  constructor(lyrics: string[], song_name: string) {
    this.lyrics = lyrics;
    this.song_name = song_name;
  }
}
