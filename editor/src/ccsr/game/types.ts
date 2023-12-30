// https://stackoverflow.com/a/49936686/2936448
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends Readonly<infer U>[]
  ? Readonly<RecursivePartial<U>>[]
  : RecursivePartial<T[P]>
};

export type MapData = {
  metadata: RecursivePartial<MapMetadata>
  objects: RecursivePartial<MapObject>[]
}


export enum MapDataType {
  Metadata = "metadata",
  Object = "object",
}

/**
 * I don't think this is used in the actual game for anything
 */
export type MapMetadata = {
  dataType: MapDataType.Metadata;

  roomid: string;
  roomStatus: number;
};

/**
 * Represents the type of this object in the game world.
 */
export enum MapObjectType {
  /** A walkable floor game object, no collision */
  FLOR = "#FLOR",
  /** A wall the player collides with */
  WALL = "#WALL",
  /** Represents an in-game character to talk to */
  CHAR = "#char",
  /** An item for the player to pick up */
  ITEM = "#item",
  /** Water to boat across. Not present in Scooby games. */
  WATER = "#WATER",
  /** A door acts as a block that will teleport the player between maps */
  DOOR = "#DOOR",

  /**
   * This only ever appears once across all games, and it's used
   * for the wall obect behind the painting that disappears in the end.
   * I'm not sure why this is used.
   */
  Scooby2_floor = "#floor"
}

/**
 * Represents some object in the game world
 */
export type MapObject = {
  dataType: MapDataType.Object;

  /** The name of the texture to use for this object */
  member: string;

  /**
   * The type of game object.
   * For whatever reason this root level type is always #FLOR
   * for ALL objects across every game, both CCSR and Scooby.
   * 
   * The type property in data.item.type is the one that seems to determine
   * how the actual type of the object.
   */
  type: MapObjectType;

  /** X, Y starting offset of this object within the map */
  location: MapObjectLocation;

  /** The width in pixels of this game object */
  width: number;

  /** The X-offset shift amount */
  WSHIFT: number;

  /** The height in piexels of this game object */
  height: number;

  /** The Y-offset shift amount */
  HSHIFT: number;

  /** Data related to this game object */
  data: MapObjectData;
};

export type MapObjectLocation = {
  x: number;
  y: number;
};

export type MapObjectData = {
  item: MapObjectItem;
  move: MapObjectMove;
  message: MapObjectMessage[];
};

export type MapObjectItem = {
  name: string;
  type: MapObjectType;
  visi: MapObjectVisibility;
  COND: (MapObjectCond | null)[];
};

export type MapObjectMove = {
  U: number;
  d: number;
  L: number;
  R: number;
  COND: number;
  TIMEA: number;
  TIMEB: number;
};

export type MapObjectMessage = {
  text: string;
  plrObj: string;
  plrAct: string;
};

export type MapObjectVisibility = {
  visiObj: string;
  visiAct: string;
  inviObj: string;
  inviAct: string;
};

export type MapObjectCond = {
  hasObj: string;
  hasAct: string;
  giveObj: string;
  giveAct: string;
}
