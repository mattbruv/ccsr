declare namespace CCSR {
  namespace File {
    export type MapFile = {
      filename: string;
      objectTree: CCSR.Parser.LingoValue;
      data: string;
    };
  }
}
