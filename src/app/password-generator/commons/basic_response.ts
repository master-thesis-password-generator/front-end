export class BasicResponse {
  crackingTime: string;
  isSafe: boolean;

  constructor(crackingTime: string, isSafe: boolean) {
    this.crackingTime = crackingTime;
    this.isSafe = isSafe;
  }
}
