import LingoTokenType = CCSR.Lexer.LingoTokenType;

const lingoTokenRegex: Record<CCSR.Lexer.LingoTokenType, RegExp> = {
  [LingoTokenType.WhiteSpace]: /^\s+/,
  [LingoTokenType.LeftBracket]: /^\[/,
  [LingoTokenType.RightBracket]: /^]/,
  [LingoTokenType.Identifier]: /^#\w+/,
  [LingoTokenType.String]: /^"(.*?)"/,
  [LingoTokenType.Number]: /^\d+/,
  [LingoTokenType.Comma]: /^,/,
  [LingoTokenType.Colon]: /^:/,
};

type LexResult = {
  error: boolean;
  tokens: CCSR.Lexer.LingoToken[];
};

export function lexTokens(input: string): LexResult {
  const tokens: CCSR.Lexer.LingoToken[] = [];

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

function nextMatch(
  input: string,
  startIndex: number
): CCSR.Lexer.LingoToken | null {
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
