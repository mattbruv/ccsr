//import test from "./0106.txt?raw";
import test from "./test.txt?raw";
import { getTokens } from "./tokens";
import {
  LingoArray,
  LingoIdentifier,
  LingoLiteral,
  LingoNumber,
  LingoObject,
  LingoProperty,
  LingoString,
  LingoToken,
  LingoTokenType,
  LingoValue,
} from "./types";

export default test;

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
      return [{ value: token.value }, tokens.slice(1)];
    case LingoTokenType.String:
      return [{ value: token.value }, tokens.slice(1)];
    case LingoTokenType.Number:
      return [{ value: Number(token.value) }, tokens.slice(1)];
    default:
      throw new Error("Unexpected token type: " + token.type);
  }
}

function parseLingoObject(tokens: LingoToken[]): [LingoObject, LingoToken[]] {
  let children: LingoProperty[] = [];
  tokens = tokens.slice(1); // Skip the opening bracket

  while (tokens[0].type !== LingoTokenType.RightBracket) {
    let key = tokens[0];
    tokens = tokens.slice(2); // Skip the key and the colon
    let [value, remainingTokens] = parseLingoValue(tokens);
    children.push({ key: { value: key.value }, value });
    tokens = remainingTokens;

    if (tokens[0].type === LingoTokenType.Comma) {
      tokens = tokens.slice(1); // Skip the comma
    }
  }

  return [{ children }, tokens.slice(1)]; // Skip the closing bracket
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

  return [{ children }, tokens.slice(1)]; // Skip the closing bracket
}

const parse = getTokens(test);
console.log(parse.tokens);
const result = parseLingoValue(parse.tokens)[0];
console.log(result);
