import test from "./0106.txt?raw";
//import test from "./test.txt?raw";

export default test;

type LingoValue = LingoObject | LingoArray | LingoLiteral;

type LingoObject = {
  children: LingoProperty[];
};

type LingoArray = {
  children: LingoValue[];
};

type LingoProperty = {
  key: LingoIdentifier;
  value: LingoValue;
};

type LingoLiteral = LingoString | LingoNumber;
type LingoIdentifier = string;
type LingoNumber = number;
type LingoString = string;

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

type ParseResult = {
  error: boolean;
  tokens: LingoToken[];
};

const lingoTokenRegex: Record<LingoTokenType, RegExp> = {
  [LingoTokenType.WhiteSpace]: /^\s+/,
  [LingoTokenType.LeftBracket]: /^\[/,
  [LingoTokenType.RightBracket]: /^]/,
  [LingoTokenType.Identifier]: /^#\w+/,
  [LingoTokenType.String]: /^"(.*?)"/,
  [LingoTokenType.Number]: /^\d+/,
  [LingoTokenType.Comma]: /^,/,
  [LingoTokenType.Colon]: /^:/,
};

function parseMap(input: string): ParseResult {
  const tokens: LingoToken[] = [];

  let index = 0;
  let match = nextMatch(input, index);

  while (match) {
    tokens.push(match);
    input = input.slice(match.value.length, input.length);
    index += match.value.length;
    match = nextMatch(input, index);
  }

  return {
    error: input !== "",
    tokens: tokens.filter((t) => t.type !== LingoTokenType.WhiteSpace),
  };
}

function nextMatch(input: string, startIndex: number): LingoToken | null {
  const tokens = Object.entries(lingoTokenRegex);

  for (const [token, regex] of tokens) {
    const match = input.match(regex);
    if (!match) continue;
    return {
      index: startIndex,
      type: parseInt(token),
      value: match[0],
    };
  }

  return null;
}

const result = parseMap(test);
console.log(result);
