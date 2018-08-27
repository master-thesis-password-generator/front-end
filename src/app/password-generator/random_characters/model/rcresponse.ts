import { BasicResponse } from '../../commons/basic_response';

export class RCResponse extends BasicResponse {
  password: string;

  constructor(crackingTime: string, isSafe: boolean, password?: string) {
    super(crackingTime, isSafe);
    this.password = password;
  }
}
