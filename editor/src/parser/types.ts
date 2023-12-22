// Given the types defined below,
// Write a parser that will recursively parse each LingoValue.
// Lingo is like JSON, except instead of {} for denoting objects, it uses [].

export type LingoValue = LingoObject | LingoArray | LingoLiteral;
export type LingoLiteral = LingoIdentifier | LingoString | LingoNumber;

export type LingoObject = {
  children: LingoProperty[];
};

export type LingoArray = {
  children: LingoValue[];
};

export type LingoProperty = {
  key: LingoIdentifier;
  value: LingoValue;
};

export type LingoIdentifier = {
  value: string;
};

export type LingoNumber = {
  value: number;
};

export type LingoString = {
  value: number;
};

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
