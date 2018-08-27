import { RCResponse } from '../../random_characters/model/rcresponse';

export class RWResponse extends RCResponse {
  passwordWords: string[];
  crackingTime: string;
  usedWords: string[];
  colors: string[];
  password: string;

  constructor(passwordWords: string[], crackingTime: string, used_words: string[],
              colors: string[], password: string, isSafe: boolean) {
    super(crackingTime, isSafe);
    this.passwordWords = passwordWords;
    this.usedWords = used_words;
    this.colors = colors;
    this.password = password;
  }
}
