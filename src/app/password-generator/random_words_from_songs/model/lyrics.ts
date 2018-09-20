export class Lyrics {
  lyrics: string[];
  songName: string;

  constructor(lyrics: string[], songName: string) {
    this.lyrics = lyrics;
    this.songName = songName;
  }
}
