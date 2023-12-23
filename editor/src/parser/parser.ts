//import test from "./0106.txt?raw";
import { getTransitionRawChildren } from "vue";
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
  LingoType,
  LingoValue,
} from "./types";
import { VLayout } from "vuetify/components";

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
      return [
        { value: token.value, type: LingoType.Identifier },
        tokens.slice(1),
      ];
    case LingoTokenType.String:
      return [{ value: token.value, type: LingoType.String }, tokens.slice(1)];
    case LingoTokenType.Number:
      return [
        { value: Number(token.value), type: LingoType.Number },
        tokens.slice(1),
      ];
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
    children.push({
      key: { value: key.value, type: LingoType.Identifier },
      value,
    });
    tokens = remainingTokens;

    if (tokens[0].type === LingoTokenType.Comma) {
      tokens = tokens.slice(1); // Skip the comma
    }
  }

  return [{ children, type: LingoType.Object }, tokens.slice(1)]; // Skip the closing bracket
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

const parse = getTokens(test);
console.log(parse.tokens);
const result = parseLingoValue(parse.tokens)[0];
console.log(result);

if (result.type === LingoType.Array) {
  console.log(result.children);
  const first = result.children[0];
  if (first.type === LingoType.Object) {
    console.log("first child is an object!");
    console.log(first.children[0].key.type);
  }
}
