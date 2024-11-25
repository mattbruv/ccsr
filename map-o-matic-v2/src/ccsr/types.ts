import { MapData, MapObject } from "./game/types";

export type UUID = ReturnType<typeof crypto.randomUUID>

// Represents a .ZIP project file in memory
export type Project = {
  metadata: ProjectMetadata
  maps: MapFile[]
  images: ImageFile[]
  state: ProjectState
}

export type ProjectState = {
  selectedMap: UUID | null,
  selectedObject: UUID | null,
  exportAsJSON: boolean
  exportPretty: boolean
}

export type TrashObject = {
  obj: MapObject
  deletedAtIndex: number
}

// Contains all information related to a game map
export type MapFile = {
  render: MapRenderSettings
  random_id: UUID;
  filename: string;
  file_text: string;
  /** The parser result from this file's text */
  // parseResult: ASTParseResult

  /** The Map Data parsed into a useable Javascript Object */
  data: MapData;
  trashedObjects: TrashObject[]
};

export type MapRenderSettings = {
  showMap: boolean
  showMapGrid: boolean
  showMapBorder: boolean
  showCollision: boolean
  showMoveBoxes: boolean
  collisionAlpha: number
}

export type ImageFile = {
  path: string;
  filename: string;
  originalData: Blob
  data: Blob;
  randomId: UUID
};

// Contains metadata about a project
export type ProjectMetadata = {
  name: string;
  author: string;
};
