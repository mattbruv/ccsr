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

export type LingoIdentifier = string;
export type LingoNumber = number;
export type LingoString = string;

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
