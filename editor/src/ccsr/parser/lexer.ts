import { LingoTokenType, LingoToken } from "./types";

const lingoTokenRegex: Record<LingoTokenType, RegExp> = {
  [LingoTokenType.WhiteSpace]: /^\s+/,
  [LingoTokenType.LeftBracket]: /^\[/,
  [LingoTokenType.RightBracket]: /^]/,
  [LingoTokenType.Identifier]: /^#\w+/,
  [LingoTokenType.String]: /^"([^"]*)"/,
  [LingoTokenType.Number]: /^\d+/,
  [LingoTokenType.Comma]: /^,/,
  [LingoTokenType.Colon]: /^:/,
};

type LexResult = {
  errorIndex?: number;
  tokens: LingoToken[];
};

export function lexTokens(input: string): LexResult {
  const tokens: LingoToken[] = [];

  let index = 0;
  let match = nextMatch(input, index);

  while (match) {
    tokens.push(match);
    input = input.slice(match.fullMatch.length, input.length);
    index += match.fullMatch.length;
    match = nextMatch(input, index);
  }

  const result: LexResult = {
    tokens: tokens.filter((t) => t.type !== LingoTokenType.WhiteSpace),
  };

  if (input !== "") result.errorIndex = index

  return result;
}

function nextMatch(input: string, startIndex: number): LingoToken | null {
  const tokens = Object.entries(lingoTokenRegex);

  for (const [token, regex] of tokens) {
    const match = input.match(regex);
    if (!match) continue;

    const fullValue = match[0];
    let groupValue = fullValue;
    const type = parseInt(token);

    if (type === LingoTokenType.String) {
      groupValue = match[1]
    }

    return {
      index: startIndex,
      type,
      fullMatch: fullValue,
      groupMatch: groupValue
    };
  }

  return null;
}
