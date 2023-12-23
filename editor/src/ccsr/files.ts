import { LingoValue } from "./parser/types";

declare namespace CCSR {
  namespace File {
    export type MapFile = {
      filename: string;
      objectTree: LingoValue;
      data: string;
    };
  }
}
