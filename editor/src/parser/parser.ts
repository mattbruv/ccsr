//import test from "./0106.txt?raw";
import test from "./test.txt?raw";
import { getTokens } from "./tokens";
import {
  LingoArray,
  LingoLiteral,
  LingoToken,
  LingoTokenType,
  LingoValue,
} from "./types";

export default test;

class Parser {
  input: string;
  parseError = false;
  astError = false;
  tokens: LingoToken[];

  constructor(input: string) {
    this.input = input;
    const result = getTokens(input);
    this.parseError = result.error;
    this.tokens = result.tokens;
  }

  parse(tokens: LingoToken[]): [LingoValue, LingoToken[]] {
    // TODO
    return [{ children: [] }, tokens];
  }

  //
  parseArray(tokens: LingoToken[]): [LingoArray, LingoToken[]] {
    const array: LingoArray = {
      children: [],
    };
    let next = tokens[0];

    if (next.type === LingoTokenType.RightBracket)
      return [array, tokens.slice(1, tokens.length)];

    while (true) {
      const [value, tokens] = this.parse(tokens);
      //
    }

    throw Error("Expected end-of-array bracket: ]");
  }
}

const map = new Parser(test);
console.log(map.parseError, map.tokens);
