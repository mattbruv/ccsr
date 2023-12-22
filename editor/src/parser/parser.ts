//import test from "./0106.txt?raw";
import test from "./test.txt?raw";

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
  [LingoTokenType.WhiteSpace]: /\s+/g,
  [LingoTokenType.LeftBracket]: /\[/g,
  [LingoTokenType.RightBracket]: /]/g,
  [LingoTokenType.Identifier]: /#\w+/g,
  [LingoTokenType.String]: /"(.*?)"/g,
  [LingoTokenType.Number]: /\d+/g,
  [LingoTokenType.Comma]: /,/g,
  [LingoTokenType.Colon]: /:/g,
};

function getAllTokens(input: string): LingoToken[] {
  const tokens = lingoTokenRegex;
  return Object.entries(lingoTokenRegex)
    .flatMap(([tokenType, regex]) => {
      const matches = [...input.matchAll(regex)];

      return matches.map((match) => {
        const type = parseInt(tokenType);
        const token: LingoToken = {
          index: match.index ?? -1,
          type: type,
          value: match[0],
        };
        return token;
      });
    })
    .filter((x) => x.index >= 0 && x.type !== LingoTokenType.WhiteSpace)
    .sort((a, b) => a.index - b.index);
}

console.log(getAllTokens(test));
