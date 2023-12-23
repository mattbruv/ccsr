// Given the types defined below,
// Write a parser that will recursively parse each LingoValue.
// Lingo is like JSON, except instead of {} for denoting objects, it uses [].
// A lingo object can be differentiated from an array by checking to see if the first token is a [, the second token is an identifier, and the third token is a colon.
// Don't use shift(), prefer not mutating exisiting arrays, go for a functional style instead
// items in lingo arrays are separated by commas. You should never find commas outside of arrays

declare namespace CCSR {
  namespace Parser {
    export enum LingoType {
      Object = "object",
      Array = "array",
      Identifier = "identifier",
      Number = "number",
      String = "string",
    }

    export type LingoValue = LingoObject | LingoArray | LingoLiteral;
    export type LingoLiteral = LingoIdentifier | LingoString | LingoNumber;

    export type LingoObject = {
      type: LingoType.Object;
      children: LingoProperty[];
    };

    export type LingoArray = {
      type: LingoType.Array;
      children: LingoValue[];
    };

    export type LingoProperty = {
      key: LingoIdentifier;
      value: LingoValue;
    };

    export type LingoIdentifier = {
      type: LingoType.Identifier;
      value: string;
    };

    export type LingoNumber = {
      type: LingoType.Number;
      value: number;
    };

    export type LingoString = {
      type: LingoType.String;
      value: string;
    };
  }

  namespace Lexer {
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

    export type LingoToken = {
      type: LingoTokenType;
      value: string;
      index: number;
    };
  }
}
