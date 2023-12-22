//import test from "./0106.txt?raw";
import test from "./test.txt?raw";
import { getTokens } from "./tokens";
import { LingoToken, LingoTokenType } from "./types";

export default test;

class Parser {
  input: string;
  parseError = false;
  astError = false;
  tokens: LingoToken[];

  private currentToken = 0;

  constructor(input: string) {
    this.input = input;
    const result = getTokens(input);
    this.parseError = result.error;
    this.tokens = result.tokens;
  }

  private match(types: LingoTokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: LingoTokenType): LingoToken {
    if (this.check(type)) return this.advance();
    throw Error("Parsing error!!!");
  }

  private check(type: LingoTokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): LingoToken {
    if (!this.isAtEnd()) this.currentToken++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.tokens.length === this.currentToken;
  }

  private peek(): LingoToken {
    return this.tokens[this.currentToken];
  }

  private previous(): LingoToken {
    return this.tokens[this.currentToken - 1];
  }
}

const map = new Parser(test);
console.log(map.parseError, map.tokens);
