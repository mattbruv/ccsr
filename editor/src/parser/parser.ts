import test from "./0106.txt?raw";

export default test;

export enum LingoTokenType {
  LeftBracket,
  RightBracket,
  Identifier,
  String,
  Number,
  Comma,
  Colon,
  WhiteSpace,
}

type LingoToken = {
  type: LingoTokenType;
  value: string;
  index: number;
};

const lingoTokenRegex: Record<LingoTokenType, RegExp> = {
  [LingoTokenType.WhiteSpace]: /\s+/,
  [LingoTokenType.LeftBracket]: /\[/,
  [LingoTokenType.RightBracket]: /]/,
  [LingoTokenType.Identifier]: /#\w+/,
  [LingoTokenType.String]: /"(.*?)"/,
  [LingoTokenType.Number]: /\d+/,
  [LingoTokenType.Comma]: /,/,
  [LingoTokenType.Colon]: /:/,
};

console.log(lingoTokenRegex[LingoTokenType.Identifier]);
