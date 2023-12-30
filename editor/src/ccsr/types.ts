import { MapData } from "./game/types";
import { ASTParseResult } from "./parser/parser";
import { LingoValue } from "./parser/types";

// Contains all information related to a game
export type Project = {
  maps: MapFile[];
  images: ImageFile[];
  metadata: Metadata;
};

export type MapFile = {
  filename: string;
  filetext: string;

  /** The parser result from this file's text */
  parseResult: ASTParseResult

  /** The Map Data parsed into a useable Javascript Object */
  data?: MapData
};

export type ImageFile = {
  path: string;
  filename: string;
  filetype: string;
  data: string;
};

// Contains metadata about a project
export type Metadata = {
  name: string;
  author: string;
};
