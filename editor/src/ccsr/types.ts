import { LingoValue } from "./parser/types";

// Contains all information related to a game
export type Project = {
  maps: MapFile[];
  metadata: Metadata;
};

export type MapFile = {
  filename: string;
  objectTree: LingoValue;
  data: string;
};

// Contains metadata about a project
export type Metadata = {
  name: string;
  author: string;
};
