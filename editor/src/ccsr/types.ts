import { LingoValue } from "./parser/types";

// Contains all information related to a game
export type Project = {
  maps: MapFile[];
  images: ImageFile[];
  metadata: Metadata;
};

export type MapFile = {
  filename: string;
  objectTree: LingoValue;
  data: string;
};

export type ImageFile = {
  filename: string;
  data: string;
};

// Contains metadata about a project
export type Metadata = {
  name: string;
  author: string;
};
