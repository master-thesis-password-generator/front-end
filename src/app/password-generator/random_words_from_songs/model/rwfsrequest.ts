import { Mapping } from '../../commons/mapping';

export class RWFSRequest {
  mappings: Mapping[];
  casingRule: string;
  songLine: string;

  constructor(mappings: Mapping[], casingRule: string, songLine: string) {
    this.mappings = mappings;
    this.casingRule = casingRule;
    this.songLine = songLine;
  }
}
