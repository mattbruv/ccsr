import { lexTokens } from "./lexer";
import {
  LingoValue,
  LingoToken,
  LingoTokenType,
  LingoType,
  LingoObject,
  LingoProperty,
  LingoArray,
} from "./types";

export type ASTParseResult = {
  /** A description of the parser error if it exists */
  error?: string;
  /** The lingo value parsed from the string */
  value: LingoValue;
};

function parseLingoValue(tokens: LingoToken[]): [LingoValue, LingoToken[]] {
  let token = tokens[0];

  switch (token.type) {
    case LingoTokenType.LeftBracket:
      if (
        tokens[1].type === LingoTokenType.Identifier &&
        tokens[2].type === LingoTokenType.Colon
      ) {
        return parseLingoObject(tokens);
      } else {
        return parseLingoArray(tokens);
      }
    case LingoTokenType.Identifier:
      return [
        { value: token.fullMatch, type: LingoType.Identifier },
        tokens.slice(1),
      ];
    case LingoTokenType.String:
      return [{ value: token.groupMatch, type: LingoType.String }, tokens.slice(1)];
    case LingoTokenType.Number:
      return [
        { value: Number(token.fullMatch), type: LingoType.Number },
        tokens.slice(1),
      ];
    default:
      throw new Error("Unexpected token type: " + token.type);
  }
}

function parseLingoObject(tokens: LingoToken[]): [LingoObject, LingoToken[]] {
  let properties: LingoProperty[] = [];
  tokens = tokens.slice(1); // Skip the opening bracket

  while (tokens[0].type !== LingoTokenType.RightBracket) {
    let key = tokens[0];
    tokens = tokens.slice(2); // Skip the key and the colon
    let [value, remainingTokens] = parseLingoValue(tokens);
    properties.push({
      key: { value: key.fullMatch, type: LingoType.Identifier },
      value,
    });
    tokens = remainingTokens;

    if (tokens[0].type === LingoTokenType.Comma) {
      tokens = tokens.slice(1); // Skip the comma
    }
  }

  return [{ properties, type: LingoType.Object }, tokens.slice(1)]; // Skip the closing bracket
}

function parseLingoArray(tokens: LingoToken[]): [LingoArray, LingoToken[]] {
  let children: LingoValue[] = [];
  tokens = tokens.slice(1); // Skip the opening bracket

  while (tokens[0].type !== LingoTokenType.RightBracket) {
    let [value, remainingTokens] = parseLingoValue(tokens);
    children.push(value);
    tokens = remainingTokens;

    if (tokens[0].type === LingoTokenType.Comma) {
      tokens = tokens.slice(1); // Skip the comma
    }
  }

  return [{ children, type: LingoType.Array }, tokens.slice(1)]; // Skip the closing bracket
}

export function parseMap(data: string): ASTParseResult {
  const lexResult = lexTokens(data);

  if (lexResult.error) {
    return {
      error: "Error parsing text at character:",
      value: { children: [], type: LingoType.Array },
    };
  }

  try {
    return {
      value: parseLingoValue(lexResult.tokens)[0],
    };
  } catch (e) {
    return {
      error: "Error parsing AST: " + e,
      value: { children: [], type: LingoType.Array },
    };
  }
}
